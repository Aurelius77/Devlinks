'use server';

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

let clientPromise;

function getClient() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in process.env');
  }
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDevsCollection() {
  const client = await getClient();
  return client.db('devlinks').collection('devs');
}

function generateShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

function processLinks(links = []) {
  return links.map((l) => ({
    id: l.id || generateShortCode(),
    name: l.name || 'Link',
    link: l.link || '',
    shortCode: l.shortCode || generateShortCode(),
    clicks: typeof l.clicks === 'number' ? l.clicks : 0
  }));
}

export async function run(userFirstName, userLastName, userImage, userEmail, userPassword, userLinks, username) {
  try {
    const db = await getDevsCollection();
    const formattedLinks = processLinks(userLinks);

    const user = {
      name: userFirstName,
      lastname: userLastName,
      image: userImage,
      email: userEmail,
      password: userPassword,
      links: formattedLinks,
      username: username,
      profileViews: 0,
      createdAt: new Date()
    };

    const existingUser = await db.findOne({
      $or: [{ email: userEmail }, { username: username }]
    });

    if (existingUser) {
      return { success: false, message: 'Email or Username already exists' };
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await db.insertOne({ ...user, password: hashedPassword });
    return { success: true, message: 'Profile has been successfully created' };
  } catch (err) {
    console.error('Run Server Action Error:', err);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function login(email, password) {
  try {
    const db = await getDevsCollection();
    const user = await db.findOne({ email: email });

    if (!user) {
      return { success: false, message: 'Incorrect Details' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Incorrect Password' };
    }

    // Ensure links have shortCodes and strip non-serializable _id / password fields
    const { _id, password: userPass, ...safeUser } = user;
    const formattedLinks = processLinks(safeUser.links || []);
    // Force plain-object serialization to strip MongoDB ObjectId / Date toJSON methods
    // that break Next.js server action responses
    const plainUser = JSON.parse(JSON.stringify({ ...safeUser, links: formattedLinks }));
    return { success: true, message: plainUser };
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: 'Something went wrong. Please try again' };
  }
}

export async function getUser(username) {
  try {
    const db = await getDevsCollection();
    const data = await db.findOne({ username: username });
    if (!data) {
      return null;
    }

    // Increment profile views
    await db.updateOne({ username: username }, { $inc: { profileViews: 1 } });

    const formattedLinks = processLinks(data.links || []);
    const { password, _id, ...safeData } = data;
    const plainData = JSON.parse(JSON.stringify({ ...safeData, links: formattedLinks }));
    return plainData;
  } catch (err) {
    console.error('getUser Error:', err);
    return null;
  }
}

export async function trackClick(username, shortCodeOrId) {
  try {
    const db = await getDevsCollection();
    await db.updateOne(
      { username: username, "links.shortCode": shortCodeOrId },
      { $inc: { "links.$.clicks": 1 } }
    );
    return { success: true };
  } catch (err) {
    console.error('trackClick Error:', err);
    return { success: false };
  }
}

export async function getLinkByShortCode(shortCode) {
  try {
    const db = await getDevsCollection();
    const user = await db.findOne({ "links.shortCode": shortCode });

    if (!user) return null;

    const targetLink = (user.links || []).find((l) => l.shortCode === shortCode);
    if (!targetLink) return null;

    // Increment click counter asynchronously
    await db.updateOne(
      { _id: user._id, "links.shortCode": shortCode },
      { $inc: { "links.$.clicks": 1 } }
    );

    return targetLink.link;
  } catch (err) {
    console.error('getLinkByShortCode Error:', err);
    return null;
  }
}

export async function getAnalytics(username) {
  try {
    const db = await getDevsCollection();
    const user = await db.findOne({ username: username });

    if (!user) {
      return {
        profileViews: 0,
        totalClicks: 0,
        ctr: 0,
        topLink: null,
        links: []
      };
    }

    const links = processLinks(user.links || []);
    const profileViews = user.profileViews || 0;
    const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const ctr = profileViews > 0 ? ((totalClicks / profileViews) * 100).toFixed(1) : 0;

    const sortedLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const topLink = sortedLinks.length > 0 && sortedLinks[0].clicks > 0 ? sortedLinks[0] : null;

    return JSON.parse(JSON.stringify({
      profileViews,
      totalClicks,
      ctr,
      topLink,
      links: sortedLinks
    }));
  } catch (err) {
    console.error('getAnalytics Error:', err);
    return {
      profileViews: 0,
      totalClicks: 0,
      ctr: 0,
      topLink: null,
      links: []
    };
  }
}

export async function updateUserInfo(email, firstname, lastname, image, links, username) {
  try {
    const db = await getDevsCollection();
    const user = await db.findOne({ email: email });

    if (!user) {
      return { success: false, message: 'There is no such user in the database' };
    }

    const formattedLinks = processLinks(links || []);

    await db.updateOne(
      { email: email },
      {
        $set: {
          email: email,
          name: firstname,
          lastname: lastname,
          image: image,
          links: formattedLinks,
          username: username
        }
      }
    );
    return { success: true, message: 'Profile details updated successfully' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function sendResetEmail(email) {
  try {
    const db = await getDevsCollection();
    const uniqueCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    await db.insertOne({ email, code: uniqueCode, createdAt: new Date() });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${uniqueCode}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Code sent to your email.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
}

export async function resetPassword(email, password) {
  try {
    const db = await getDevsCollection();
    const user = await db.findOne({ email: email });

    if (!user) {
      return { success: false, message: 'There is no such user in the database' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.updateOne({ email: email }, { $set: { password: hashedPassword } });
    return { success: true, message: 'Password has been updated' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
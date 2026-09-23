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

async function getDevsCollection() {
  const client = await getClient();
  return client.db('devlinks').collection('devs');
}

export async function run(userFirstName, userLastName, userImage, userEmail, userPassword, userLinks, username) {
  try {
    const db = await getDevsCollection();

    const user = {
      name: userFirstName,
      lastname: userLastName,
      image: userImage,
      email: userEmail,
      password: userPassword,
      links: userLinks,
      username: username
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

    return { success: true, message: user };
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: 'Something went wrong. Please try again' };
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

export async function getUser(username) {
  try {
    const db = await getDevsCollection();
    const data = await db.findOne({ username: username });
    if (!data) {
      return null;
    }
    // Return clean JSON object (excluding sensitive password hash if any)
    const { password, _id, ...safeData } = data;
    return safeData;
  } catch (err) {
    console.error('getUser Error:', err);
    return null;
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

export async function updateUserInfo(email, firstname, lastname, image, links, username) {
  try {
    const db = await getDevsCollection();
    const user = await db.findOne({ email: email });

    if (!user) {
      return { success: false, message: 'There is no such user in the database' };
    }

    await db.updateOne(
      { email: email },
      { $set: { email: email, name: firstname, lastname: lastname, image: image, links: links, username: username } }
    );
    return { success: true, message: 'Profile details updated successfully' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
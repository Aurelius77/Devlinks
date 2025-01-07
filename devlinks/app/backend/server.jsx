
'use server';

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

let client = new MongoClient(process.env.MONGO_URI);




let db;

/* async function connectToDatabase() {
    if (!client || !client.isConnected()) {
        client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        db = client.db('devlinks');
    }
    return db;
} */

export async function run(userFirstName, userLastName, userImage, userEmail, userPassword, userLinks, username) {
    try {
        await client.connect();
        let db = client.db('devlinks').collection('devs')

        const user = {
            "name" : userFirstName,
            "lastname" : userLastName,
            "image" : userImage,
            "email" : userEmail,
            "password" : userPassword,
            "links" : userLinks,
            "username" : username
        }
        
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
        console.error(err);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
    
    finally{
      await client.close()
    }
}

export async function login(email, password) {
    try {
        await client.connect();
       let db = client.db('devlinks').collection('devs')

        const user = await db.findOne({ email : email });
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

    finally{
      await client.close()
    }
}

export async function sendResetEmail(email) {
    await client.connect();
     let db = client.db('devlinks').collection('devs')

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

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Code sent to your email.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send email. Please try again.' };
    }
    finally{
      await client.close()
    }
}


export async function getUser(username){
    try{
     await client.connect();
     let db = client.db('devlinks').collection('devs')
     let data = await db.findOne({username : username})
     return data
    }
    catch(err){
        console.log(err)
        return {sucesss:true, message: 'Something went wrong. Please try again'}
    }
    finally{
     await client.close();
    }
}



export async function resetPassword(email, password){
  try{
     await client.connect()
     const db = client.db('devlinks').collection('devs')
     const user = await db.findOne({email:email})

     if(!user){
        return {success: false, message:'There is no such user in the database'}
     }
    if(user){
      await db.updateOne({email:email}, {$set:{password: password}})
      return {success:true, message:'Password has been updated'}
    }
  }

  catch(err){
    console.log(err)
    return {success:false, message: 'Something went wrong. Please try again.'}
  }
  finally{
    await client.close()
  }

}


export async function updateUserInfo(email, firstname, lastname, image, links, username){
  try{
     await client.connect()
     const db = client.db('devlinks').collection('devs')
     const user = await db.findOne({email:email})

     if(!user){
        return {success: false, message:'There is no such user in the database'}
     }
    if(user){
      await db.updateOne({email:email}, {$set:{email:email, firstname:firstname, lastname:lastname, image:image, links:links, username : username}})
      return {success:true, message:'Password has been updated'}
    }
  }

  catch(err){
    console.log(err)
    return {success:false, message: 'Something went wrong. Please try again.'}
  }
  finally{
    await client.close()
  }
} 
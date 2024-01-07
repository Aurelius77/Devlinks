'use server'

import { MongoClient} from 'mongodb';
const nodemailer = require('nodemailer')
const crypto = require('crypto');



const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

export async function run(userFirstName, userLastName, userImage, userEmail, userPassword, userLinks) {
    try {
        await client.connect();
        const user = {
            "name" : userFirstName,
            "lastname" : userLastName,
            "image" : userImage,
            "email" : userEmail,
            "password" : userPassword,
            "links" : userLinks 
        }
        let db = client.db("devlinks").collection('devs')
        await db.insertOne(user)
        console.log('User successfully added')
        return {sucesss: true, message:'Profile has been sucessfully created'}
    }
    catch (err) {
        console.log(err)
        return {sucesss: false, message:'Something went wrong. Please try again.'}
    }

    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}



export async function getUser(email){
    try{
     await client.connect();
     let db = client.db('devlinks').collection('devs')
     let data = await db.findOne({email : email})
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



export async function login(email, password) {
  try {
     await client.connect()
    const db = client.db('devlinks').collection('devs');
    const user = await db.findOne({ email: email });

    if (!user) {
      return { success: false, message: 'Incorrect Details' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Incorrect Password' };
    }

    return { success: true, message: user }; // Return user data upon successful authentication
  } 
  catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: 'Something went wrong. Please try again' };
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}


export async function sendResetEmail(email) {
    const uniqueCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'akinpeluifeoluwa007@gmail.com',
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'akinpeluifeoluwa007@gmail.com',
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${uniqueCode}. If you didn't request this, please ignore this mail.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Code has been sent. Please check your mail or spam', code: uniqueCode };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Something went wrong. Please try again', code: '' };
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


export async function updateUserInfo(email, firstname, lastname, image, links){
  try{
     await client.connect()
     const db = client.db('devlinks').collection('devs')
     const user = await db.findOne({email:email})

     if(!user){
        return {success: false, message:'There is no such user in the database'}
     }
    if(user){
      await db.updateOne({email:email}, {$set:{email:email, firstname:firstname, lastname:lastname, image:image, links:links}})
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
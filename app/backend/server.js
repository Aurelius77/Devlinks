'use server'

import { MongoClient } from "mongodb"

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

//Login
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

        return { success: true, message: user };
    }
    catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Something went wrong. Please try again' };
    } finally {

        if (client) {
            await client.close();
        }
    }
}

//Register
export async function Register(email, password) {
    try {
        await client.connect();
        const user = {
            "name": userFirstName,
            "lastname": userLastName,
            "image": userImage,
            "email": userEmail,
            "password": userPassword,
            "links": userLinks
        }
        let db = client.db("devlinks").collection('devs')
        await db.insertOne(user)
        console.log('User successfully added')
        return { sucesss: true, message: 'Profile has been sucessfully created' }
    }
    catch (err) {
        console.log(err)
        return { sucesss: false, message: 'Something went wrong. Please try again.' }
    }

    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
'use server';

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectToDB() {
    if (!client.isConnected()) {
        await client.connect();
    }
    return client.db('devlinks').collection('devs');
}

// Login
export async function login(email, password) {
    try {
        const db = await connectToDB();
        const user = await db.findOne({ email: email });

        if (!user) {
            return { success: false, message: 'Incorrect Details' };
        }


        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return { success: false, message: 'Incorrect Password' };
        }


        const userVal = {
            email: user.email,
            id: user._id,
        };

        return { success: true, message: 'Login successful', user: userVal };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

// Register
export async function Register(email, password) {
    try {
        const db = await connectToDB();


        const existingUser = await db.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const newUser = {
            email,
            password: hash
        };

        await db.insertOne(newUser);
        console.log('User successfully added');
        return { success: true, message: 'Profile has been successfully created' };
    } catch (error) {
        console.error('Register Error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

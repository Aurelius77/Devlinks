'use server';

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET

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
        await client.connect();
        const db = client.db('devlinks').collection('devs');
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

        const token = jwt.sign(userVal, JWT_SECRET, { expiresIn: '30d' });

        return { success: true, message: 'Login successful', user: userVal, token };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}


//Register
export async function Register(email, password) {
    try {
        await client.connect();
        const db = client.db('devlinks').collection('devs');

        const existingUser = await db.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const newUser = { email, password: hash };

        await db.insertOne(newUser);
        return { success: true, message: 'Profile has been successfully created' };
    } catch (error) {
        console.error('Register Error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    } finally {
        await client.close();
    }
}

export async function SocialLogin(e) {
    const action = e
    console.log(action)
}
'use server'

import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    }
    catch (err) {
        console.log(err)
    }

    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


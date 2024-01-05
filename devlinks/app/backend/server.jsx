'use server'

import { MongoClient, ServerApiVersion } from 'mongodb';
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
        return {sucesss: true, message:'Something went wrong. Please try again.'}
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

# Model : We have 3 model in it
1) User - information we have: _id,Channel Name, phone, password, logo subscription, subscribedChannel, timestamp

2) Video - information we have: _id, user_id, video_url, thumbnail_url, category, tags, likes, dislikes, views, likeBy, dislikeBy, viewdBy, timestamp

3) Comment- information we have: _id, video_id, commentText, user_id, timestamp

# backend routes we create:

1) user Routes: signup, login, update profile, subscribe

2) video Routes: upload video, update video, delete video, get all videos, get own videos, get videos by id, get videos by category, get video by tags

3) Comments Routes: New Comment, delete comment, edit comment, get all comments

# Install express dotenv mongoose


# importing express, creating .env file, connecting database:

- index.js:
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config.js';
dotenv.config()

const app = express()
const PORT = process.env.PORT;
connectDB()

app.get('/',(req,res)=>{
    res.send("Hey There")
})

app.listen(PORT, ()=>{
    console.log(`Server is running at port http://localhost:${PORT}`)
})

- .env:
PORT = 8080
MONGO_URI = 'mongodb://localhost:27017/utube-api'

- config/db.config.js:
import mongoose from 'mongoose';

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database Connected ❤️`)
    } catch (error) {
        console.log(error.message);
        throw new Error('Something went wrong', error);
    }
}

# now we work on creating our routes: we start with creating route for user:

- routes/user.routes.js:
import express from 'express';

const router = express.Router()

router.post('/signup',(req,res)=>{
    res.send("Hello this is a signup page")
})

export default router;

# now we setup our middlewares:

- index.js:
import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.config.js';
import userRoutes from './routes/user.routes.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT;
connectDB()

// middleware: for base url:
app.use('/api/user',userRoutes)

app.get('/',(req,res)=>{
    res.send("Hey There")
})


app.listen(PORT, ()=>{
    console.log(`Server is running at port http://localhost:${PORT}`)
})

# now we create a module for a user:

- models/user.model.js:
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    channelName:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    password:{
        type: String,
        requred: true,
    },
    logoUrl:{
        type: String,
        required: true
    },
    logoId:{
        type: String,
        required: true
    }, 
    subscribers:{
        type: Number,  
        default: 0
    },
    subscribedChannels:[
        {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }]
}, {timestamps: true});

const userModel = mongoose.Model("User", userSchema)

export default userModel

# how we can install image using postman without having a frontend: we use cloudinary:

- npm i cloudinary 
- create a config file for cloudinary: config/cloudinary.js:

import {v2 as cloudinary} from 'cloudinary';
import {config} from 'dotenv';
config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

- .env file:
PORT = 8080
MONGO_URI = 'mongodb://localhost:27017/utube-api'

CLOUDINARY_CLOUD_NAME=dpbw1dziq
CLOUDINARY_API_KEY=651998517237766
CLOUDINARY_API_SECRET=IPH-QbmomgaSNDY8HpOQSE_If3k

- we also install: npm i argon2 body-parser express-fileupload:

# creating user.routes:
import express from 'express';
import argon2 from 'argon2';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

router.post('/signup',async(req,res)=>{

    try {
        console.log("Request coming")
        const hashPassword = await argon2.hash(req.body.password, 10);
        console.log(hashPassword);
        const uploadImage = await cloudinary.uploader.upload(
            req.files.logUrl.tempFilePath
        )
        console.log("image🫳", uploadImage)

        const newUser = new User({
            _id: new mongoose.Types.ObjectId,
            email: req.body.email,
            password: hashPassword,
            channelName: req.body.channelName,
            phone: req.body.phone,
            logUrl: uploadImage.secure_url,
            logId: uploadImage.public_id
        })
    } catch (error) {
        
    }
    res.send("Hello this is a signup page")
})

export default router;

- index.js:
import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

import { connectDB } from './config/db.config.js';
import userRoutes from './routes/user.routes.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT;
connectDB()

app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}))

app.use('/api/user',userRoutes)

app.get('/',(req,res)=>{
    res.send("Hey There")
})


app.listen(PORT, ()=>{
    console.log(`Server is running at port http://localhost:${PORT}`)
})

# 
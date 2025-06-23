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

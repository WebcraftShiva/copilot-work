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
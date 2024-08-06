const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const helmet = require("helmet");
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const categoryRoute = require('./routes/category')
const uploadRoute = require('./routes/upLoad')
const orderRoute = require('./routes/order')
const dashboardRoute = require('./routes/dashboard')
const path = require('path');
dotenv.config()


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Connection error", err);
    });
const app = express()
app.use(helmet)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

//Route

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/category", categoryRoute)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1/file", uploadRoute)
app.use("/api/v1/dashboard", dashboardRoute)
app.use(express.static(path.join(__dirname, 'public')));
app.listen(8000, () => {
    console.log('Sever is running')
})
app.use("/api/v1/order", orderRoute)

//authentication : so sanh du lieu vo database
//authorization : chia role, phana quyen
//Json web token(JWT) : xac thuc nguoi dung
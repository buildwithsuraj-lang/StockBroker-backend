const express=require('express')
require("dotenv").config();

const database=require("./databases/db")
const Router=require('./Router/Router')
const Api=require('./Router/Api')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app=express();
database();
app.use(
  cors({
    origin: process.env.ORIGN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/",Router);
app.use("/auth",Api);
 app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
 })
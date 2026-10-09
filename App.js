const express=require('express')
require("dotenv").config();
const cors = require("cors");
const database=require("./databases/db")
const Router=require('./Router/Router')
const Api=require('./Router/Api')
const cookieParser = require("cookie-parser");
const app=express();
database();
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
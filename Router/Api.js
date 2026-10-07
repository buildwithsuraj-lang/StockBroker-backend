const express=require('express')
const Api=express.Router();
const logins=require('../databases/AuthSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
Api.post('/',async(req,res)=>{
    try{
    const {name,email,password}=req.body;
        const name1= name.toLowerCase();
        const email1=email.toLowerCase();
      const hash=await bcrypt.hash(password,10);
    const data=await logins.create({
        name:name1,
        email:email1,
        password:hash
    });

  res.status(200).json("User register sucessfully")
    }catch(error){
         if(error.code===11000){
        res.json(error.keyValue);
}
    }
})
Api.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  const email1 = email.toLowerCase().trim();
  try{
      const valuate=await logins.findOne({email:email1})
      if(!valuate){
      return res.status(401).json({data:"Invalid Credentials"})
      }
      const decript=await  bcrypt.compare(password,valuate.password)
      if(!decript){
      return  res.status(401).json({data:"Invalid Credentials"})
      }
     const token= await jwt.sign({
        name:valuate.name,
        email:valuate.email,
        id:valuate.id,
      },process.env.my_secrt,{expiresIn: "1d"});
      
     res.cookie("token", token, {
  httpOnly: true,
  secure: true,
 SameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});

  return res.status(200).json({
  message: "Login successful"
});
  }catch(error){
    console.log(error)
  }    

})
Api.get("/verify",async (req,res,next)=>{
    try{
      const token=req.cookies.token;
      if(!token){
           return res.status(401).json({
                   verified: false,
        message: "Please login first"
      });
      }
         const decode= await jwt.verify(token,process.env.my_secrt); 
         req.name=decode.name;
    return res.json({verified: true, message:req.name  });
    }catch(error){
           return res.status(401).json({
            message: "Invalid token",
               verified: false,
        });
    }
})
Api.get("/logout",(req,res)=>{
      res.clearCookie("token");

  res.status(201).json({
    success: true,
    verified:false,
    message: "Logged out successfully",
  });
})
Api.post("/sendotp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await logins.findOneAndUpdate(
      { email: email },
      {$set: {otp: otp,}},
      {returnDocument: 'after'}
    );
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "NextGenDeals - Email Verification",
      html: `
        <div>
          <h2>Verify your email</h2>
          <p>Your verification OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 30 seconds.</p>
        </div>
      `,
    });

   return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Could not send OTP",
    });
  } 
}); 

Api.post("/otpverify",async(req,res)=>{
  const {otp,email}=req.body;
  const num = Number(otp);
  const email1 = email.toLowerCase().trim();
  try{
  const data=await logins.findOne({email:email1}) 
  if(!data){
    return res.json({sucess:false,message:"wrong email send"});
  }
  if(data.otp===num){
    return res.status(200).json({sucess:true,message:"verified"})
  }
  return res.status(401).json({sucess:true,message:"wrong otp"})
}catch(error){
    return res.json({sucess:false,message:error})
}

})

Api.post("/newpassword",async(req,res)=>{
  try{
  const {email,password,otp}=req.body.form
  const hash=await bcrypt.hash(password,10);
  const data=await logins.findOneAndUpdate({email:email}, {$set:{password:hash,otp:0}})
   res.status(200).json({sucess:true,message:"password update sucessfully"})  
}catch(error){
    res.json({sucess:false,message:error})
  }
})
module.exports=Api
const mongoose=require('mongoose')
const Login=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
          unique:true
    },
    password:{
        type:String,
        required:true
    },
      otp:{
      type:Number,
     },
},
    {
    timestamps:true,
    }

)
const logins=mongoose.model("logins",Login)
module.exports=logins;
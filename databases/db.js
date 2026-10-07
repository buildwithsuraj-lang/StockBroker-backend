const mongoose=require('mongoose')
function database(){
  try{
  mongoose.connect(process.env.MONGO_DB).then(()=>{
  console.log("db is running")})}
  catch(erorr){
      console.log(erorr);
  }
}

module.exports=database;

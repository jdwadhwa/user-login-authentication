const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"PLEASE ENTER EMAIL"],
        unique:true,
        validate(data)
        {
            if(!validator.isEmail(data))
            {
                throw new Error("the email already exists");
            }
        }
    },
    password:{
        type:String,
        required:[true,"PLEASE ENTER YOUR PASSWORD"],
        validate(data)
        {
            if(data.length<6)
            {
                throw new Error("please neter a strong password");
            }
        }
    }
})


userschema.pre("save",async function(next){
    const user = this;
    if(user.isModified("password"))
    {
        user.password = await bcrypt.hash(user.password,8);
    }
    
    next();
})


const user =  mongoose.model("users",userschema);

module.exports = user;
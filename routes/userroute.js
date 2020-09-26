const { response } = require("express");
const express = require("express");
const user = require("../src/models/user");
const bcrypt = require("bcrypt");
const userroute =  new express.Router();
const jwt = require("jsonwebtoken");

//const requireauth = require("../middleware/authentication");

function generate(id)
{
    return jwt.sign({id},process.env.secret,{
        expiresIn:3*24*60*60
    })
}

userroute.get("/signup",(req,res)=>{
    res.render("signup");
})


userroute.get("/login",(req,res)=>{
    res.render("login")
})


userroute.post("/signup",async (req,res)=>{
    const {email,password}=req.body;
    try{

    
    var x = new user({email,password});
    x = await x.save();
    var token =  generate(x._id);
    res.cookie("jwt",token,{maxAge:3*24*60*60*1000,httpOnly:true})
    res.send({user:x._id});
    }
    catch(e)
    
    {
        console.log(e);
        if(e.code==11000)
        {
            return res.send({
                email:"this email is already taken",
                password:""
            });
        }
        var emailerr = e.errors.email.properties.message;
        var passworderr=e.errors.password.properties.message;
        if(!emailerr && !passworderr)
        {   
            
            
                res.send({
                    email:"",
                    password:""
                });
            
            
        }
        else if(emailerr && !passworderr)
        {
            res.send({
                email:"",
                password:""
            });
        }
        else if(!emailerr && passworderr)
        {
            res.send({
                email:"",
                password:passworderr
            });
            
        }
        else{
            var err={
                email:emailerr,
                password:passworderr
            }
            res.send(err);
        }
        // console.log(e.errors.email.properties.message);
        // console.log(e.errors.password.properties.message)
        //    console.log(e.message);
        // res.send(e.message)
    }
    
    
    //res.send("signup post request");
})

userroute.post("/login",async (req,res)=>{
    var err = {
        email:"",
        password:""
    }
    try{

    console.log(req.body.email);
    var x = await user.findOne({email:req.body.email});

    if(x)
    {
        
        var l = await bcrypt.compare(req.body.password,x.password);
        if(l)
        {
            var token =  generate(x._id);
            res.cookie("jwt",token,{maxAge:3*24*60*60*1000,httpOnly:true})
          return  res.send({user:x._id});
        }else{
            err.password = "please enter the correect password"
            return res.send(err);
        }
    }
    else{
        err.email = "no such user exists";
      return res.send(err);
    }
    }
    catch(e)
    {
        return res.send(err);
    }
    
})

userroute.get("/logout",(req,res)=>{
    res.cookie("jwt","",{maxAge:1});
    res.redirect("/");
})

module.exports = userroute;
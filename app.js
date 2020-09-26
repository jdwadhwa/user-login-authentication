const express = require("express");

require("./src/db/mongoose");
const userroute = require("./routes/userroute");
const app=  express();
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const authentication= require("./middleware/authentication");

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieparser());


const port = process.env.PORT||3000;

app.get("*",authentication.checkuser);
app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/smoothies",authentication.requireauth,(req,res)=>{
    res.render("smoothies");
})
app.use(userroute);
app.listen(port,()=>{
    console.log("server has started");
})
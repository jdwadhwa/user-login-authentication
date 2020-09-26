
const jwt = require("jsonwebtoken");
const user = require("../src/models/user");

const requireauth = (req,res,next)=>{

    var token= req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,process.env.secret,(err,decodede)=>{
            if(err)
            {
                res.redirect("/login");
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect("/login")
    }
}

const checkuser = (req,res,next)=>{

    var token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,process.env.secret,async(err,data)=>{
            if(err)
            {
                res.locals.user = null;
                next();
            }
            else{
                    console.log(data.id);
                var us= await user.findById(data.id);
               // console.log(us);
                res.locals.user = us;
                next();
                
            }
        })
    }
    else{
        res.locals.user=null;
        next();
    }

}


module.exports = {
    requireauth:requireauth,
    checkuser:checkuser
};
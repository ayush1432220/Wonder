const user = require("../models/user.js");


module.exports.signUpForm = (req,res)=>{
    res.render("user/signup.ejs")
};

module.exports.loginForm = (req,res)=>{
        res.render("user/login.ejs")
    };

module.exports.userLoggedIn = async(req,res)=>{
    req.flash("success","User Logged in successfully");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings")
    }
};

module.exports.userRegistered = async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        const newUser = new user({email,username});
        const registeredUser = await user.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "New User created Successfully");
        res.redirect("/listings");
        });
        
    }
    catch(error){
        req.flash("error",error.message);
        res.redirect("/user/register");
    }
    
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", " You are logged Out");
        res.redirect("/listings");
    })
};
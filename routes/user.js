const express = require('express');
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user.js")


router.route("/register")
.get( userController.signUpForm)
.post(wrapAsync(userController.userRegistered));
router
router.get("/login",userController.loginForm);
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/user/login",
    failureFlash : true,
  }),
  userController.userLoggedIn);
  
router

router.get("/logout",userController.logout)

module.exports= router;
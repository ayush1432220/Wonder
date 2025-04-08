if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
    console.log("DotEnv is configured");
}

const PORT = process.env.PORT;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require('./models/listing.js');
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js")
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const listing = require("./routes/listings.js");
const review = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const userRoute = require("./routes/user.js");
const MongoStore = require("connect-mongo")

const dbUrl = process.env.ATLAS_URL;
console.log(dbUrl);
console.log(process.env.PORT);
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.CLOUD_API_SECRET
      },
      touchAfter: 24*3600,
});
store.on("error",()=>{
    console.log("Error in mongo session")
})


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

app.engine("ejs", ejsMate);

const sessionDescription = {
    store,
    secret:process.env.CLOUD_API_SECRET,
    resave:false,
    saveUninitialized: true,  
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly:true,
    }  
}
app.use(session(sessionDescription));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
});


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));


const port = 8080;
main()
.then(()=>{
    console.log("Successfully connected to the database");
})
.catch((err)=>{
    console.log("Unable to connect to the database");
});

async function main(){
    await mongoose.connect(dbUrl)
}
//isLogged import 
// app.use((req, res, next) => {
//     res.locals.isLoggedIn = req.isAuthenticated();
//     next();
// });
// Routes
app.use("/listings",listing);
app.use("/listings/:id/reviews",review);
app.use("/user",userRoute);
app.listen(PORT,(req,res)=>{
    console.log("Server is created");
});

app.get("/showlist",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./userView/showList.ejs",{allListings});
});

app.get("/showlist/:id/viewList",async(req,res)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).send("Invalid ID format"); 
    }
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./userView/viewList.ejs",{listing});
});

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not Found"))
})

app.use((err,req,res,next)=>{
    let{message="Something went Wrong ",statuscode= 500} = err;
    res.status(statuscode).render("error.ejs",{message});
   // res.status(statuscode).send(message);
})


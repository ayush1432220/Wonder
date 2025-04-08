const Listing = require("./models/listing");
const Review = require("./models/reviews.js")
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" ,"You must be logged in to add new listing");
        return res.redirect("/user/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not an Authorised onwer");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validatListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log("Validating review...");
    if(error){
        console.log("Validation failed...");
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }   
    else{
        console.log("Validation successful...");
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId } = req.params;
    let review = await Review.findById(reviewId).populate('author');
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author) {
        req.flash("error", "Author information not found");
        return res.redirect(`/listings/${id}`);
    }
    
        if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You have no permission to delete this review");
        res.redirect(`/listings/${id}`);
    }
    else{
        next();
    }
}
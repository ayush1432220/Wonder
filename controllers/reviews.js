const Review = require("../models/reviews.js");
const Listing = require('../models/listing.js');

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","Review added successsfully");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};
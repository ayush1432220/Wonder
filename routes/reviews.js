const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require('../models/listing.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")





router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview)
);
// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
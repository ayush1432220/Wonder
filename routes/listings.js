const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })




router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"), validatListing,wrapAsync(listingController.newListing));




router.get("/new",isLoggedIn, listingController.renderIndex);


router.route("/:id")
//Show List
.get(wrapAsync(listingController.showListing))
//Update List 
.put( isLoggedIn,isOwner,upload.single("listing[image]"), validatListing, wrapAsync(listingController.updateList))
//Delete List
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteList));


// router.get("/new",isLoggedIn, listingController.renderIndex );
//Show route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editForm) );

module.exports = router;

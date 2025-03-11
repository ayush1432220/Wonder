const Listing = require("../models/listing")
const expressError = require("../utils/expressError.js");
const mongoose = require("mongoose");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings,isLoggedIn:req.isAuthenticated()});
};

module.exports.renderIndex = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).send("Invalid ID format"); 
    }
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


module.exports.newListing = async(req,res,next) =>{
    // let{title,description,image,price,country,location,} = req.body;
    // let listing = req.body.listing;
 //    if(!req.body.listing){
 //     throw new expressError(400,"Send Valid data")
 //    }
 
     const newListing = new Listing(req.body.listing);
     // if(!req.body.listing.title){                         listing validation
     //     throw new expressError(400,"Title is missing")
     //    }
     //    if(!req.body.listing.description){
     //     throw new expressError(400,"Description is missing")
     //    }
     //    if(!req.body.listing.location){
     //     throw new expressError(400,"Location is missing")
     //    }
     //    if(!req.body.listing.price){
     //     throw new expressError(400,"Price is missing")
     //    }
     newListing.owner= req.user._id;
     await newListing.save();
     req.flash("success","New Listing is Created Successfully");   
     res.redirect("/listings");
  
 };


 module.exports.editForm = async(req,res)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).send("Invalid ID format"); 
    }
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/update.ejs",{listing});
    
};

module.exports.updateList =  async(req,res)=>{
    let {id} = req.params;
    // if(!req.body.listing){  lisiting validation code 
    //     throw new expressError(400,"Send Valid data")
    //    }
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //      return res.status(400).send("Invalid ID format"); 
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is Updated Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteList = async(req,res)=>{
    let{id} =  req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).send("Invalid ID format");
     }
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted Successfully");
    res.redirect("/listings");
};


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
    
    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner= req.user._id;
     newListing.image = {url,filename};
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
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_300,w_250");
    console.log(originalUrl);
    res.render("listings/update.ejs",{listing , originalUrl});
    
};

module.exports.updateList =  async(req,res)=>{
    let {id} = req.params;
    // if(!req.body.listing){  lisiting validation code 
    //     throw new expressError(400,"Send Valid data")
    //    }
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //      return res.status(400).send("Invalid ID format"); 
    // }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
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


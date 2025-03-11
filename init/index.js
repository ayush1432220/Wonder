const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require('../models/listing.js');



async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
main()
    .then((res)=>{
        console.log("Database Created Successfully");
    })
    .catch((err)=>{
        console.log("Facing some error in the creation of connection with the database");
    });
    const initDb = async()=>{
        await Listing.deleteMany({});
        initData.data=initData.data.map((obj)=>({...obj,owner : "67cc681899485a069d2d1760"}));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");

    }
    initDb();
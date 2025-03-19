const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require('../models/listing.js');
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const dbUrl = process.env.ATLAS_URL;
if (!dbUrl) {
    throw new Error("ATLAS_URL environment variable is not defined.");
}
const initDb = async()=>{
    try{
        await Listing.deleteMany({});
        console.log("All listings deleted!");
        initData.data=initData.data.map((obj)=>({...obj,owner : "67cc681899485a069d2d1760"}));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    }catch(e){
        console.log(e);
    }

}
async function main(){
    try{
        await mongoose.connect(dbUrl, {
            useNewUrlParser: false,
            useUnifiedTopology: false,
            serverSelectionTimeoutMS: 30000
        });
        console.log("Database Created Successfully");
        await initDb();
    }catch(e){
        console.log(e);
    }

}
main();
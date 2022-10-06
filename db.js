const mongoose = require('mongoose');


const connectToMongo = ()=>{
    mongoose.connect("mongodb+srv://nssgecr:nssgecr21@nssgecr.rnm645l.mongodb.net/?retryWrites=true&w=majority/", ()=>{
        console.log("connected to mongoDB");
    })
}
module.exports = connectToMongo;
const mongoose = require('mongoose');

// const db_url = process.env.DB_URL || "mongodb+srv://nssgecr:9753318620@cluster0.u1gdxdi.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = ()=>{
    try {
    mongoose.connect(db_url, ()=>{
        console.log("connected to mongoDB");
    })
} catch (error) {
 console.log(error);       
}
}
module.exports = connectToMongo;
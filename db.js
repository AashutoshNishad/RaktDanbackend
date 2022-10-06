const mongoose = require('mongoose');

const db_url = process.env.DB_URL;

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
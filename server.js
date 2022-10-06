const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();
const app = express();
const port = process.env.PORT | 5000;

//This commented code below is also known as a route/path
// app.get('/', (req,res)=>{
//     res.send("Hello World!")
// })
app.use(cors());
//express.json will allow us to send request body content as middleware
app.use(express.json());

//Adding routes from the routes folder:
app.use("/" , require("./Routes/request"));

app.use("/user" , require("./Routes/auth"));
// app.get("/" ,(req,res)=>{
//     res.send("I am working")
// })

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})
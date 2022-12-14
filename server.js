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
// app.use(express.static("./build"))
app.use(cors());
//express.json will allow us to send request body content as middleware
app.use(express.json());
//Adding routes from the routes folder:
app.use("/" , require("./Routes/request"));
app.use("/user" , require("./Routes/auth"));

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  })
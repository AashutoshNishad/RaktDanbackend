const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fetchuser = require('../middleware/fetchUser');
const volunteer = require('../modal/Volunteer');

//JWT_SECRET will be passed for jwt token creation. It will be the part of the jwt which will help us to verify if the token is tempered
const JWT_SECRET = 'Utsav#$%Soni';

//ROUTE 1: create a user using: POST '/api/auth/createuser'. No login required
router.post('/checkuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email').isEmail(),
], async (req, res) => {
    let success = false;
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({success, errors: errors.array() });
    }

    //check whether the user with this email exists already
    try {
        let user = await volunteer.findOne({ EmailId: req.body.email });
        if (user) {
           return res.send(user);
        }
        
        return res.status(400).send("User Not Found");
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, error: "Internal server error"});
    }
})

//ROUTE 2: Authenticate a user using: POST 'api/auth/login'. No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await volunteer.findOne({EmailId: email });
        let success = false;
        if (!user) {
            return res.status(400).json({success, error: "Please login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({success,  error: "Please login with correct credentials" });
        }

        //data will be a unique key which will be passed for jwt token creation.
        const data = {
            user: {
                id: user.id
            }
        }
        //this function will create a jwt token. It is a synchronous function, therefore we need not to use await here.
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({success,  authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, error: "Internal server error"});
    }

})

//ROUTE 3: Get loggedIn User details using: POST "/api/auth/getuser". Login required
router.post('/getuser', async (req, res) => {
    let success = true;
    try {
        //if jwt verification succeeds, req.user will contain the user details from fetchuser.js
        const userId = req.user.id;
        const user = await volunteer.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        success = false;
        console.error(error.message);
        res.status(500).json({success, error: "Internal server error"});
    }
});
module.exports = router;
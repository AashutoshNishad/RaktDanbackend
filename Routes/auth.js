const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const fetchuser = require('../middleware/fetchUser');
const volunteer = require("../modal/Volunteer");
// const sendmail = require("../midware/sendMail");
const fs = require("fs");
const { new_registration_mail } = require("../midware/Mails/AUthmails");
const fetchuser = require("../midware/FetchUser");
//JWT_SECRET will be passed for jwt token creation. It will be the part of the jwt which will help us to verify if the token is tempered
const JWT_SECRET = "Utsav#$%Soni";

//ROUTE 1: create a user using: POST '/api/auth/createuser'. No login required
router.post(
  "/checkuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email").isEmail(),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success, errors: errors.array() });
    }

    //check whether the user with this email exists already
    try {
      let user = await volunteer.findOne({ EmailId: req.body.email });
      if (user) {
        var tocken = jwt.sign(
          {
            Id: user._id,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );
        // var mainoptin = {
        //     subject: "Raktdan registration varifcation email.",
        //     html: fs.readFile("./")
        // }

        var rsp2 = await new_registration_mail(
          user.StudentName,
          user.EmailId,
          `${process.env.FRONTEND_URL || "http://192.168.76.73:3000/register/" }/${tocken}`
        );
        //    if(rsp2.success == true)
        console.log(rsp2);
        return res.send({ success: true });
        //    else
        //    return res.status.send({success: false , error: "Email Not send."})
      }
      return res.status(400).send({success: false , error: "Email not found."});
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success, error: "Internal server error" });
    }
  }
);

//ROUTE 2: Authenticate a user using: POST 'api/auth/login'. No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await volunteer.findOne({ EmailId: email });
      let success = false;
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please login with correct credentials" });
      }

      //data will be a unique key which will be passed for jwt token creation.
      const data = {
        user: {
          id: user.id,
        },
      };
      //this function will create a jwt token. It is a synchronous function, therefore we need not to use await here.
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success, tpken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success, error: "Internal server error" });
    }
  }
);

//ROUTE 3: Get loggedIn User details using: POST "/api/auth/getuser". Login required
router.post("/getuser", async (req, res) => {
  let success = true;
  try {
    //if jwt verification succeeds, req.user will contain the user details from fetchuser.js
    const userId = req.user.id;
    const user = await volunteer.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    success = false;
    console.error(error.message);
    res.status(500).json({ success, error: "Internal server error" });
  }
});

router.get("/register/*", async (req, res) => {
  try {
    // console.log(req);
    // return res.send(.originalUrl)
    const token = req.url.replace("/register/", "");
    const data = jwt.verify(token, JWT_SECRET);
    var rsp = await volunteer.findById(data.Id);
    // var rsp = await volunteer.findById("12dsf545dsfds");
    // console.log();
    if (!rsp) {
      return res.status(400).json({ success: false });
    }
    var newtoken = jwt.sign({ Id: rsp._id }, JWT_SECRET);
    return res.json({ token: newtoken, success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error");
  }
});

// router.post(
//   "/changepassword",
//   [
//     body("password", "Follow correct manner to write password").isLength({
//       min: 8,
//     }),
//   ],
//   fetchuser,
//   async (req, res) => {
//     try {
//       var Id = req.user;
//       var rsp = await volunteer
//         .findById(Id)
//         .updateOne({ $set: { password: req.body.password } });
//       return res.send({ success: true });
//     } catch (error) {}
//   }
// );

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/request",
  [
    body("CName", "Enter currect name", "enter currect length")
      .notEmpty()
      .isAlpha()
      .isLength({ min: 3, max: 50 }),

    body("PName", "Enter currect name", "enter currect length")
      .notEmpty()
      .isAlpha()
      .isLength({ min: 3, max: 50 }),

    body("Hospital", "Enter currect name", "enter currect length")
      .notEmpty()
      .isLength({ min: 3, max: 200 }),
    body("Adress", "Enter currect name", "enter currect length")
      .notEmpty()
      .isLength({ min: 3, max: 1000 }),
    body("Cmobile", "enter correct phone number").isNumeric().isLength(10),
    body("BloodGroup", "enter correct blood group")
      .notEmpty()
      .custom((value) => {
        var arr = ["A+", "B+", "0+", "O-", "A-", "B-", "AB+", "AB-"];
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (value.toUpperCase() == element) {
            // req.body.BloodGroup = req.body.BloodGroup.toUpperCase();
            return true;
          }
        }

        return false;
      })
      .withMessage("Enter correct blood group"),
  ],
  (req, res) => {
    const err = validationResult(req);


    // show error if any input missing in req.body

    if (!err.isEmpty()) {
      return res.send(err.array());
    }

    // code 

    res.send(req.body);
  }
);
module.exports = router;

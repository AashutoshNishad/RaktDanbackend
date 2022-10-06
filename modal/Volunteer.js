const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    StudentName: {
        type: String,
        required: true
    },
    FatherName: {
        type: String,
        required: true
    },
    EmailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        default: "jihjkhjgyuvvyuivhjh",
    },
    EnrollmentNo: {
        type: String,
    },
    RollNo: {
        type: Number,
    },
    MobileNo: {
        type: Number,
        require: true,
        unique: true,
    },
    Gender: {
        type: String,
        enum: ["Male" , "Female" , "OTHER"]
    },
    Branch: {
        type: String,
        // enum: ["CIVIL" , "EEE" , "CSE" , "MECH" , ""]
    },
    Year: {
        type: Number,
    },
    Category: {
        type: String,
    },
    NSSYear: {
        type: String,
    },
    // AadhaarNo: {
    //     type: Number,
    // },
    Address: {
        type: String,
    },
    RagistrationNo: {
        type: String,
    }
});

const volunteer = mongoose.model('volunteer', UserSchema);

//here email is unique: true so we have created an index corresponding to it and therefore no entries with duplicate email will be allowed in the database:-
// User.createIndexes();
//we will create similar logic of no duplicate email entries in db in auth.js

module.exports = volunteer;
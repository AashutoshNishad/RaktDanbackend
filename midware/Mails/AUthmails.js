// const sendmail = require("../SendMail")

const sendmail = require("../sendmail");

module.exports.new_registration_mail = (Name, Email , url) => {
  const fs = require("fs");
  fs.readFile(
    __dirname + "/MailTampletes/MEMBER_VARIFICATION.html",
    "utf-8",
    (err, d) => {
      var data = d.replace("#__NAME_OF_VOLUNTEER__#", Name);
      data = data.replace("#__REGISTRATION_URL__#", url);
        // console.log(data);
    return  sendmail(Email, {
        subject: "Raktad new ragistration varification.",
        html: data,
      });
    }
  );
};

// console.log("______ @@@@@@@@@@@@@@ _______");
// console.log(data);

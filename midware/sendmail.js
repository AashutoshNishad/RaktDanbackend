
async function sendmail(to , content){
    const nodemailer = require("nodemailer");
    var email = process.env.EMAIL || 0;
    var password = process.env.EMAIL_PASSWORD || 0;
    
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: email,
          pass: password,
        },
      });
    
    
      var mailOptions = {
        from: email,
        to: to,
        subject: content.subject
        
    };
    
    if(content.html){
        mailOptions.html = content.html;
    }
    if(content.text){
        mailOptions.text = content.text;
    }
    if(content.attachments){
        mailOptions.attachments = content.attachments;
    }
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error :"+ mailOptions.to);
          
          console.log(error);
          return {sucess: false , error: error};
        } else {
          console.log(info.accepted);
          return {sucess: true , data: info};
        }
      });
    
    }
    
    module.exports = sendmail;
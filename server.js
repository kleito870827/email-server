const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const emailConfig = require('./.config.js');
//nodemailer
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var transporter = nodemailer.createTransport("SMTP",{
        service:"Gmail",
        auth:{
            XOAuth2: {
                user: emailConfig.user,
                clientId: emailConfig.clientId,
                clientSecret: emailConfig.clientSecret,
                refreshToken: emailConfig.refreshToken
            }
        }
});

app.set('port', 8082);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req,res){
  console.log("got a request to the server root");
  res.sendFile(__dirname + '/views/email-form.html');
});

app.post('/', function(req,res){
  console.log('Receives post request');
  console.log(req.body);
  var mailOptions = {
    to: req.body.to,
    from: "kleito870827@gamil.com",
    subject: req.body.subject,
    html: req.body.message
  };
  transporter.sendMail(mailOptions, function(err, info){
    if(err){
      console.log(err.toString());
      return res.status(500).send("send bad");
    }
    res.send("Email sent: "+ info);
  });
})

app.listen(app.get('port'), function(){
  console.log(`server is listening ${app.get('port')}`);
});

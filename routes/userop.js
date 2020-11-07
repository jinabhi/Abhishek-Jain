const router = require('express').Router();
//const mongoose = require('mongoose');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abhisheknodepractice@gmail.com',
    pass: 'Abhi@1234'
  }
});

//const users = mongoose.model('users')
var users = require('.././models/users');



router.get('/loginhome', (req, res) => {
    res.render('loginhome');
  });
  
  router.get('/userhome', (req, res) => {
    res.render('userhome');
  });

router.post('/register',(req,res)=>{
    var name = req.body.nname;
    var email = req.body.nemail;
    var pswd = req.body.npwd;
    var user = users({
      name: name,
      email: email,
      pwd: pswd,
    });
    user.save().then((data) => {
      var mailOptions = {
          from: 'abhisheknodepractice@gmail.com',
          to: email,
          subject: 'Your New Account Password',
          text: 'Hello '+name+", Your new account has been created.\nYour New Account password is "+ pswd
        };
        transporter.sendMail(mailOptions, function(err, info){
          if (err) throw err;
          else {
              res.render('loginhome', {
                  msg: 'New Account Created for '+name+' ...!!',
                });
          }
            })
    });
})

router.post('/userlogin', (req, res) => {
    var useremail = req.body.usemail;
    var pswd = req.body.uspass;
        users.find({ email: useremail, pwd: pswd }, (err, result) => {
        if (err) throw err;
        else if (result.length != 0) {
          res.render('userhome');
        } else res.render('loginhome', { msg: 'Login Fail' });
      });
    })

    module.exports = router;
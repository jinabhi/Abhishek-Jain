const express = require('express');
const path=require('path')
const hbs=require('express-handlebars')
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
const session=require('express-session')

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abhisheknodepractice@gmail.com',
    pass: 'Abhi@1234'
  }
});

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))

app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')

app.engine('hbs',hbs(
    {
  extname:'hbs',
  defaultlayout:'main',
  layoutsDir:__dirname+'/views/layouts/'
}
))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
	extended:true
}))

app.use(function (req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache,private,no-store,must-revalidate,max-state=0,post-check=0,pre-check=0'
  );
  next();
});

app.use(session({ secret: 'asasasasas' }));

const URL = 'mongodb://localhost:27017/demoapp';
mongoose.connect(URL, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.render('loginhome');
  });

  app.get('/loginhome', (req, res) => {
    res.render('loginhome');
  });

  var users = require('./models/users');

  app.post('/register',(req,res)=>{
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

  app.post('/userlogin', (req, res) => {
    var useremail = req.body.usemail;
    var pswd = req.body.uspass;
    req.session.user = useremail;
        users.find({ email: useremail, pwd: pswd }, (err, result) => {
        if (err) throw err;
        else if (result.length != 0) {
          res.render('userhome',{uid: req.session.user});
        } else res.render('loginhome', { msg: 'Login Fail' });
      });
    })

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.render('loginhome');
      });
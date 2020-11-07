const express = require('express');
const path=require('path')
const hbs=require('express-handlebars')
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
// const cookieParser = require('cookie-parser')
// const jwt = require('json-web-token')


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


const URL = 'mongodb://localhost:27017/demoapp';
mongoose.connect(URL, { useNewUrlParser: true });


var ind = require("./routes/userop");

  app.use('/userapi', ind);

  app.get('/', (req, res) => {
    res.render('loginhome');
  });

  
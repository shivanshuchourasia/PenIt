const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost/penIt-dev', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch((e) => console.log(e));

const {Idea} = require('./models/Idea');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  var title = 'Welcome';
  res.render('index',{title});
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
})

app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  } 
  if(!req.body.details){
    errors.push({text: 'Please add details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else{
    var idea = new Idea({
      title: req.body.title,
      details: req.body.details
    });
  
    idea.save().then((idea) => {
      res.redirect('/ideas');
    }).catch((e) => {
      res.status(400).send();
    });
  }
})

app.get('/ideas', (req, res) => {
  Idea.find()
    .sort({date: 'desc'})
    .then((ideas) => {
    res.render('ideas/index', {ideas});
  }).catch((e) => {
    res.status(400).send(e);
  })
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
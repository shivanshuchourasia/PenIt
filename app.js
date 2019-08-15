const express = require('express');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

mongoose.connect('mongodb://localhost/penIt-dev', {useNewUrlParser: true, useFindAndModify: false})
  .then(() => console.log('MongoDB Connected...'))
  .catch((e) => console.log(e));

const {Idea} = require('./models/Idea');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

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
      req.flash('success_msg', 'Idea is successfully added');
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

app.get('/ideas/edit/:id', (req, res) => {
  Idea.findById(req.params.id).then((idea) => {
    res.render('ideas/edit', {idea});
  })
})

app.put('/ideas/:id', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  } 
  if(!req.body.details){
    errors.push({text: 'Please add details'});
  }

  if(errors.length > 0){
    res.render('ideas/edit', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else{
    Idea.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        details: req.body.details
      }
    }).then((idea) => {
      req.flash('success_msg', 'Idea is updated');
      res.redirect('/ideas');
    })
  }
});

app.delete('/ideas/:id', (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then(() => {
    req.flash('success_msg', 'Idea is removed');
    res.redirect('/ideas');
  })
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
const express = require('express');
const methodOverride = require('method-override');
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

app.use(methodOverride('_method'));

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
      res.redirect('/ideas');
    })
  }
});

app.delete('/ideas/:id', (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then(() => res.redirect('/ideas'))
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
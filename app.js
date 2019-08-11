const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/penIt-dev', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch((e) => console.log(e));

const {Idea} = require('./models/Idea');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  var title = 'Welcome';
  res.render('index',{title});
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.post('/ideas/add', (req, res) => {
  var idea = new Idea({
    title: 'My Shop',
    details: 'Pastry Shop'
  });

  idea.save().then(() => {
    res.send('Idea Added');
  }).catch((e) => {
    res.status(400).send();
  });
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
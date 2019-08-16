const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

const ideas = require('./routes/ideas');
const users = require('./routes/users');

mongoose.connect('mongodb://localhost/penIt-dev', {useNewUrlParser: true, useFindAndModify: false})
  .then(() => console.log('MongoDB Connected...'))
  .catch((e) => console.log(e));

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
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/ideas', ideas);
app.use('/users', users);

app.get('/', (req, res) => {
  var title = 'Welcome';
  res.render('index',{title});
});

app.get('/about', (req, res) => {
  res.render('about');
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
const mongoose = require('mongoose');

if(!process.env.NODE_ENV){
  process.env.DB = 'mongodb://localhost/penIt-dev';
  process.env.PORT = 5000;
}

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch((e) => console.log(e));
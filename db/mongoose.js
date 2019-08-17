const mongoose = require('mongoose');

if(!process.env.NODE_ENV){
  process.env.DB = 'mongodb://localhost/penIt-dev';
  process.env.PORT = 5000;
}

mongoose.connect(process.env.DB, {useNewUrlParser: true, useFindAndModify: false})
  .then(() => console.log('MongoDB Connected...'))
  .catch((e) => console.log(e));
//WWzy59NMn5UtqvDe
//mongodb+srv://Shivanshu:<password>@penit-db-f49os.mongodb.net/test?retryWrites=true&w=majority
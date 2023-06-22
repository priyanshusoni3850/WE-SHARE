const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/file-sharing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


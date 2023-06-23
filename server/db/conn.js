// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://priyanshuair3850:Manu3850@sharing.7kr0e5n.mongodb.net/?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error(err);
});

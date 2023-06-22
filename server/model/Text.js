const mongoose = require('mongoose');
const textSchema = new mongoose.Schema({
          content: String,
          code: String,
        });

const Text = new mongoose.model('Text', textSchema);
module.exports=Text;
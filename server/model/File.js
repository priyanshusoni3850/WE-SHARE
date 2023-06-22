
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
          filename: String,
          Code:String,
          originalname: String,
          mimetype: String,
          size: Number,
        });

const File = new mongoose.model('File', fileSchema);
module.exports=File;
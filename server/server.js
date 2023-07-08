const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const File = require("./model/File");
const Text = require("./model/Text");
require("./db/conn");

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*',
  methods: ["POST", "GET"],
  credentials: true
}));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static('../frontend/build'));

// Set up storage location for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

// Endpoint for uploading files
app.post('/api/upload', upload.array('files'), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploadedFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploadedFile = new File({
      filename: file.filename,
      Code: req.body.Code,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    await uploadedFile.save();
    uploadedFiles.push(uploadedFile);
  }

  return res.json(uploadedFiles);
});

// Endpoint for downloading files
app.get('/api/download/:Code', async (req, res) => {
  const FindCode = req.params.Code;
  const filedata = await File.findOne({ Code: FindCode });
  
  if (!filedata) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  const filePath = path.join(__dirname, 'uploads', filedata.filename);
  console.log(filePath);
  
  // Set the Content-Disposition header to "attachment"
  res.setHeader('Content-Disposition', `attachment; filename="${filedata.originalname}"`);
  
  // Set the Content-Type header based on the file mimetype
  res.setHeader('Content-Type', filedata.mimetype);
  
  res.sendFile(filePath);
});

// Your commented code for sharing text
// app.post('/api/share', async (req, res) => {
//   console.log("hitted");
//   const text = req.body.text || '';
//   console.log(text);
//   const client_code = req.body.clientcode;
//   console.log(client_code);

//   let code_exist=await Text.findOne({code:client_code}).exec();

//   if(code_exist){
//     code_exist.content=text;
//     await code_exist.save();
//     return res.json({ message: 'Text shared successfully' });
//   }else{
//     const sharedText = new Text({ content: text ,code:client_code});
//     await sharedText.save();
//     return res.json({ message: 'Text shared successfully' });

//   }
// });

// Endpoint for sharing text
app.post('/api/share', async (req, res) => {
  console.log("hitted");
  const text = req.body.text || '';
  console.log(text);
  const client_code = req.body.clientcode;
  console.log(client_code);

  let code_exist = await Text.findOne({ code: client_code }).exec();

  if (code_exist) {
    code_exist.content = text;
    await code_exist.save();
    return res.json({ message: 'Text shared successfully' });
  } else {
    const sharedText = new Text({ content: text, code: client_code });
    await sharedText.save();
    return res.json({ message: 'Text shared successfully' });
  }
});

// Your commented code for fetching shared text
// app.get('/api/shared-text/:getcode', async (req, res) => {
//   const getcode=req.params.getcode;
//   const sharedText = await Text.findOne({code:getcode});
//   return res.json({ text: sharedText ? sharedText.content : '' });
// });

// Endpoint for fetching shared text
app.get('/api/shared-text/:getcode', async (req, res) => {
  const getcode = req.params.getcode;
  const sharedText = await Text.findOne({ code: getcode });
  return res.json({ text: sharedText ? sharedText.content : '' });
});

// Your commented code for checking code availability
// app.get('/api/check-code/:code', async (req, res) => {
//   const options = { maxTimeMS: 20000 };
//   const code = req.params.code;

//   const result = await File.findOne({ Code: code.toString() }, null, {timeout:30000});

//   console.log(result);

//   if (result) {
//     console.log("exist");
//     return res.json({ message:true });
//   } else {
//     return res.json({ message: false });
//   } 
// });

// Endpoint for checking code availability
app.get('/api/check-code/:code', async (req, res) => {
  const options = { maxTimeMS: 20000 };
  const code = req.params.code;

  const result = await File.findOne({ Code: code.toString() }, null, { timeout: 30000 });

  console.log(result);

  if (result) {
    console.log("exist");
    return res.json({ message:true });
  } else {
    return res.json({ message: false });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));












































// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const File=require("./model/File");
// require("./db/conn")

// const app = express();
// const port = process.env.PORT || 3001;

// // Set up middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());

// // Set up static files
// app.use(express.static('public'));

// // Set up MongoDB connection
// // mongoose.connect('mongodb://localhost/text-file-sharing', { useNewUrlParser: true });


// // Define schema for file model
// // const fileSchema = new mongoose.Schema({
// //   name: String,
// //   path: String
// // });

// // Define file model
// // const File = mongoose.model('File', fileSchema);

// // Define routes
// /*
// MyModel.find().then((docs) => {
//   // handle the results
// }).catch((err) => {
//   // handle the error
// });
// */
// app.get('/api/files', function(req, res) {

//           File.find().then((docs)=>{
//                     res.json(docs);
//           }).catch((err)=>{
//                     console.log(err);
//           })
// });

// app.post('/api/files', function(req, res) {
//   const file = new File();
//   file.name = req.body.name;
//   file.path = req.body.path;
//   console.log(file.name);
//   file.save().then(()=>{
//             res.send('File uploaded successfully!');

//   }
//   ).catch((err)=>{
//           console.log(err);
//   })
// });

// // Start server
// app.listen(port, function() {
//   console.log(`Server started on port ${port}`);
// });

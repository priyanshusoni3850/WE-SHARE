const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const File=require("./model/File");
const Text=require("./model/Text");
require("./db/conn")
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());


// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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
            fileSize: 5 * 1024 * 1024, // 5 MB
          },
        });


// Endpoint for uploading files
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  // console.log(file);
  // console.log(req.body.Code);
  if (!file) {
          // res.send("no file");
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const uploadedFile = new File({
    filename: file.filename,
    Code:req.body.Code,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });
  await uploadedFile.save();
  return res.json(uploadedFile);
});

// Endpoint for downloading files
app.get('/api/download/:Code', async(req, res) => {
  // console.log("clicked");
  const FindCode = req.params.Code;
  const filedata=await File.findOne({Code:FindCode});
  const filename=await filedata.filename;
  const save=`${__dirname}/uploads/${filename}`;
  save.save();
  // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

// Set the Content-Disposition header to "attachment"
res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

// Set the Content-Type header based on the file extension
const ext = path.extname(filename);
let contentType = 'application/octet-stream';
switch (ext) {
  case '.docx':
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    break;
  case '.pdf':
    contentType = 'application/pdf';
    break;
  default:
    break;
}
res.setHeader('Content-Type', contentType);


app,get("/",(req,res)=>{
  res.send("hii");
})

  res.sendFile(save);
  // res.sendFile(`${__dirname}/uploads/${filename}`);
});



///////////////////////////////////////////////////////old code /////////////////////////////////////////////////////////

// Endpoint for sharing text
// app.post('/api/share', async (req, res) => {
//   const text = req.body.text || '';
//   // console.log(text);
//   const sharedText = new Text({ content: text });
//   await sharedText.save();
//   return res.json({ message: 'Text shared successfully' });
// });



///////////////////////////////////////////////////////////old code //////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////new code ////////////////////////////////////////////////////////

app.post('/api/share', async (req, res) => {
  console.log("hitted");
  const text = req.body.text || '';
  console.log(text);
  const client_code = req.body.clientcode;
  console.log(client_code);

  const code_exist=await Text.findOne({code:client_code});

  if(code_exist){
    code_exist.content=text;
    await code_exist.save();
    return res.json({ message: 'Text shared successfully' });
  }else{
    const sharedText = new Text({ content: text ,code:client_code});
    await sharedText.save();
    return res.json({ message: 'Text shared successfully' });

  }
  
  // console.log(text);
  // const sharedText = new Text({ content: text ,code:client_code});
  // await sharedText.save();
});









////////////////////////////////////////////////////////////////new code//////////////////////////////////////////////////////


////////////////////////////////////////////////////////////old code //////////////////////////////////////////////////////////

// Endpoint for fetching shared text
// app.get('/api/shared-text', async (req, res) => {
//   const sharedText = await Text.findOne().sort({ _id: -1 });
//   return res.json({ text: sharedText ? sharedText.content : '' });
// });

///////////////////////////////////////////////////////////old code ///////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////new code /////////////////////////////////////////////////////////


app.get('/api/shared-text/:getcode', async (req, res) => {
  const getcode=req.params.getcode;
  const sharedText = await Text.findOne({code:getcode});
  // const sharedText = await Text.findOne().sort({ _id: -1 });
  return res.json({ text: sharedText ? sharedText.content : '' });
});


/////////////////////////////////////////////////////////// new code///////////////////////////////////////////////////////////


// cheking for code

app.get('/api/check-code/:code', async (req, res) => {
  // console.log("checked");
  const { code } = req.params;
  console.log(code);
  const result = await File.findOne({ Code:code });
  // console.log(result);

  if (result) {
    // res.send("already exist");
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

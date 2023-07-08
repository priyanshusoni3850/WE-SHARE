const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const File = require("./model/File");
const Text = require("./model/Text");
const AdmZip = require('adm-zip');
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
app.post('/api/upload', upload.array('file'), async (req, res) => {
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
  const code = req.params.Code;
  const files = await File.find({ Code: code });

  if (!files || files.length === 0) {
    return res.status(404).json({ error: 'Files not found' });
  }

  const zip = new AdmZip();
  const zipFileName = `files_${code}.zip`;

  files.forEach((file) => {
    const filePath = path.join(__dirname, 'uploads', file.filename);
    zip.addLocalFile(filePath);
  });

  const buffer = zip.toBuffer();

  // Set the Content-Disposition header to "attachment"
  res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

  // Set the Content-Type header to "application/zip"
  res.setHeader('Content-Type', 'application/zip');

  // Send the zip file as response
  res.send(buffer);
});

// Endpoint for sharing text
app.post('/api/share', async (req, res) => {
  const text = req.body.text || '';
  const client_code = req.body.clientcode;

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

// Endpoint for fetching shared text
app.get('/api/shared-text/:getcode', async (req, res) => {
  const getcode = req.params.getcode;
  const sharedText = await Text.findOne({ code: getcode });
  return res.json({ text: sharedText ? sharedText.content : '' });
});

// Endpoint for checking code availability
app.get('/api/check-code/:code', async (req, res) => {
  const options = { maxTimeMS: 20000 };
  const code = req.params.code;

  const result = await File.findOne({ Code: code.toString() }, null, { timeout: 30000 });

  if (result) {
    return res.json({ message: true });
  } else {
    return res.json({ message: false });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

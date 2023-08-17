
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Destination folder for storing uploaded files

// Define a route to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Get the file name and destination path
  const fileName = req.file.originalname;
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Move the uploaded file to the desired location
  fs.rename(req.file.path, filePath, err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error occurred while saving the file.');
    }
    
    res.send('File uploaded successfully.');
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
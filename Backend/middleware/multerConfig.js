

const multer = require('multer');
const path = require("path")

// Define storage with destination and filename settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Public/temp")); // Uploads to "public/temp" folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Saves the file with its original name
  }
});


// Configure multer with storage, file size limits, and file type filters
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only PDF, DOC, and DOCX file types
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only PDF and DOC/DOCX files are allowed.'), false); // Reject the file
    }
  }
});

module.exports = upload;


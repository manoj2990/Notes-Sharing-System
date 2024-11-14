
const express = require('express');
const { uploadNote, deleteNote } = require('../controllers/uploadNotesController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); 

const router = express.Router();

console.log("now present at noteRoutes...")
router.post('/uploadNote', authMiddleware, upload.single('file'), uploadNote);
router.delete('/deleteNotes/:id', authMiddleware, deleteNote);

module.exports = router;

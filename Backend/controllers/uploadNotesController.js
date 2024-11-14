

const NotesModel = require('../models/notes');
const { uploadOnCloudinary } = require("../utilityFiles/cloudinaryUtils");
const { deleteFromCloudinary, extractPublicIdFromUrl } = require("../utilityFiles/cloudinaryUtils");


// uploade note
// exports.uploadNote = async (req, res) => {
//   try {
 
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }

   
//     const { subject, forClass, unit, semester, fileSize, documentType } = req.body;
//     const uploadedBy = req.user?.id;
//     const fileType =  req.file?.originalname.split('.')[1];
   
    
//     const cloudinaryResponse = await uploadOnCloudinary(req.file?.path);
//         if (!cloudinaryResponse) {
//             return res.status(500).json({ message: "File upload to Cloudinary failed." });
//         }

  
//     const newNote = new NotesModel({
//       subject,
//       forClass,
//       unit,
//       semester,
//       fileSize,
//       fileType,
//       documentType,
//       file: cloudinaryResponse.url, 
//       uploadedBy,
//     });

    
//     await newNote.save();

    
//     return res.status(201).json({
//       message: 'Note uploaded successfully!',
//       newNote,
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(401).json({ message: 'Internal server error.' });
//   }
// };








exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { subject, forClass, unit, semester, fileSize, documentType } = req.body;
    const uploadedBy = req.user?.id;
    const fileType = req.file?.originalname.split('.')[1];

    // Pass the buffer directly to Cloudinary for upload
    const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer); // Change to req.file.buffer

    if (!cloudinaryResponse) {
      return res.status(500).json({ message: 'File upload to Cloudinary failed.' });
    }

    const newNote = new NotesModel({
      subject,
      forClass,
      unit,
      semester,
      fileSize,
      fileType,
      documentType,
      file: cloudinaryResponse.url, // Save Cloudinary URL in DB
      uploadedBy,
    });

    await newNote.save();

    return res.status(201).json({
      message: 'Note uploaded successfully!',
      newNote,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};







///deleteNotes

exports.deleteNote = async (req, res) => {
  try {
   

    const note = await NotesModel.findById(req.params.id);
  
    if (!note) {
      
      return res.status(404).json({ success: false, msg: 'Note not found or deleted before' });
    }

  
    if (note.uploadedBy.toString() !== req.user.id) {
      
      return res.status(401).json({ success: false, msg: 'Not authorized' });
    }


   
    const publicId = extractPublicIdFromUrl(note.file);
   
    if (!publicId) {
      return res.status(500).json({ success: false, msg: 'Error extracting file ID' });
    }


    const deleteResponse = await deleteFromCloudinary(publicId);
    
    if (!deleteResponse) {
      return res.status(500).json({ success: false, msg: 'Failed to delete file from Cloudinary' });
    }
   

    await NotesModel.findByIdAndDelete(req.params.id);
    

  
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (err) {
  
    res.status(500).json({
      success: false,
      error: 'Server error at deleting note',
    });
  }
};


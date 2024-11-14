

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
  console.log("entering into uplodeNote controller....")
  try {
    if (!req.file) {
      console.log("No file found in the request.");
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log("File received:", req.file.originalname);
    console.log("File size:", req.file.size);
    console.log("File MIME type:", req.file.mimetype);

    const { subject, forClass, unit, semester, fileSize, documentType } = req.body;
    const uploadedBy = req.user?.id;
    console.log("User ID from token:", uploadedBy);

    const fileType = req.file?.originalname.split('.')[1];
    console.log("File type detected:", fileType);

    // Pass the buffer directly to Cloudinary for upload
    const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer); // Change to req.file.buffer
    console.log("Cloudinary response:", cloudinaryResponse);

    if (!cloudinaryResponse) {
      console.error("File upload to Cloudinary failed.");
      return res.status(500).json({ message: 'File upload to Cloudinary failed.' });
    }

    console.log("Saving note to database...");
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
    console.log("Note saved successfully:", newNote);
    
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


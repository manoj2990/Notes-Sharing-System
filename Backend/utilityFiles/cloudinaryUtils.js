// const { cloudinary } = require("../config/cloudinary"); // Updated import
// const fs = require("fs");

// // Helper function to upload file on Cloudinary
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//             console.error("localFilePath is not found!");
//             return null;
//         }
       
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             folder: 'NotesPdf',
//             allowed_formats: ['pdf', 'doc', 'docx'],
//             resource_type: 'raw',
//         });

        

//         // Remove the local file after successful upload
//         fs.unlinkSync(localFilePath);
        

//         return response;

//     } catch (error) {
        
       

//         // Attempt to remove the local file in case of an error during upload
//         try {
//             fs.unlinkSync(localFilePath);
            
//         } catch (unlinkError) {
//             console.error("Error deleting local file:", unlinkError.message);
//         }

//         return null;
//     }
// };


// // Helper function to delete file from Cloudinary
// const deleteFromCloudinary = async (publicId) => {
//     try {
//         if (!publicId) {
//             console.error("publicId is not found!");
//             return false;
//         }

//         const response = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        
//         if (response.result !== 'ok') {
//             console.error("Failed to delete file from Cloudinary");
//             return false;
//         }

        
//         return true;

//     } catch (error) {
//         console.error("Error deleting file from Cloudinary:", error.message);
//         return false;
//     }
// };

// // Helper function to get PublicId from URL
// const extractPublicIdFromUrl = (url) => {
//     const parts = url.split('/');
//     const fileName = parts[parts.length - 1];
//     const filefolder = parts[parts.length - 2];
//     const publicId = filefolder + "/" + fileName;
    
//     return publicId;
// };




// module.exports = { 
//     uploadOnCloudinary,
//     deleteFromCloudinary,
//     extractPublicIdFromUrl
// };


const { cloudinary } = require("../config/cloudinary");

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9-_\.]/g, '_'); // Replace invalid characters with underscores
};

const uploadOnCloudinary = (fileBuffer, filename) => {
  console.log("fileBuffer =>", fileBuffer)
  console.log('File details before upload:', {
    mimetype: req.file.mimetype,
    originalname: req.file.originalname,
  });
  
  return new Promise((resolve, reject) => {
    const sanitizedFilename = sanitizeFilename(filename);
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', 
        folder: 'NotesPdf',
        allowed_formats: ['pdf', 'doc', 'docx'],
        public_id: sanitizedFilename,
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading file to Cloudinary:", error.message);
          reject(error);
        } else {
          console.log("File uploaded to Cloudinary:", result);
          resolve(result);
        }
      }
    ).end(fileBuffer); 
  });
};


const deleteFromCloudinary = async (publicId) => {
  console.log("Public ID to delete:", publicId);
  try {
    if (!publicId) {
      console.error("publicId is not found!");
      return false;
    }

  
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    console.log("Cloudinary delete response:", response);

    if (response.result !== 'ok' ) {
      console.error("Failed to delete file from Cloudinary");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    return false;
  }
};


// const extractPublicIdFromUrl = (url) => {
//   try {
//     const parts = url.split('/');
//     const fileName = parts[parts.length - 1].split('.')[0]; 
//     const fileFolder = parts[parts.length - 2];
//     const publicId = `${fileFolder}/${fileName}`;
    
//     console.log("Extracted public ID:", publicId);
//     return publicId;
//   } catch (error) {
//     console.error("Error extracting public ID from URL:", error.message);
//     return null;
//   }
// };


const extractPublicIdFromUrl = (url) => {
  try {
    // Split the URL into parts
    const parts = url.split('/');

    // Decode the filename and folder
    const encodedFileName = parts[parts.length - 1]; // e.g., "Backend%2BRoadmap.pdf"
    const decodedFileName = decodeURIComponent(encodedFileName); // Decoded: "Backend+Roadmap.pdf"
  
    const fileFolder = decodeURIComponent(parts[parts.length - 2]); // e.g., "NotesPdf"

    // Construct the public_id with the folder and file name
    const publicId = `${fileFolder}/${decodedFileName}`;
    
    console.log("Extracted public ID:", publicId);
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error.message);
    return null;
  }
};


module.exports = { 
  uploadOnCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl
};

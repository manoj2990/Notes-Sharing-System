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


const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', 
        folder: 'NotesPdf',
        allowed_formats: ['pdf', 'doc', 'docx'],
        
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


const extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1].split('.')[0]; 
    const fileFolder = parts[parts.length - 2];
    const publicId = `${fileFolder}/${fileName}`;
    
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

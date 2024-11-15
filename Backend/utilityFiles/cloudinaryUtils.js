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
  console.log("File Buffer Length:", fileBuffer.length);
console.log("First 10 Bytes of File Buffer:", fileBuffer.slice(0, 10));

  
  
  return new Promise((resolve, reject) => {
    const sanitizedFilename = sanitizeFilename(filename);
    console.log("sanitizedFilename =>", sanitizedFilename)
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', 
        folder: 'NotesPdf',
        
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

    
//     // Split the URL into parts
//     const parts = url.split('/');

//     // Decode the filename and folder
//     const encodedFileName = parts[parts.length - 1]; // e.g., "Backend%2BRoadmap.pdf"
//     const decodedFileName = decodeURIComponent(encodedFileName); // Decoded: "Backend+Roadmap.pdf"
  
//     const fileFolder = decodeURIComponent(parts[parts.length - 2]); // e.g., "NotesPdf"

//     // Construct the public_id with the folder and file name
//     const publicId = `${fileFolder}/${decodedFileName}`;
    
//     console.log("Extracted public ID:", publicId);
//     return publicId;
//   } catch (error) {
//     console.error("Error extracting public ID from URL:", error.message);
//     return null;
//   }
// };

const extractPublicIdFromUrl = (url) => {
  try {
    let publicId = null;

    if (url.includes("docs.google.com/gview")) {
      // Extract the `url` parameter from the Google Docs URL
      const urlParams = new URLSearchParams(new URL(url).search);
      const embeddedUrl = urlParams.get("url");
      
      if (embeddedUrl) {
        // Decode the embedded URL and treat it like a Cloudinary URL
        url = decodeURIComponent(embeddedUrl);
      }
    }

    // Handle Cloudinary URLs
    const parts = url.split('/');
    const encodedFileName = parts[parts.length - 1]; // e.g., "Backend_Roadmap.pdf"
    const decodedFileName = decodeURIComponent(encodedFileName); // Decoded: "Backend_Roadmap.pdf"
    const fileFolder = decodeURIComponent(parts[parts.length - 2]); // e.g., "NotesPdf"

    // Construct the public_id
    publicId = `${fileFolder}/${decodedFileName}`;

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

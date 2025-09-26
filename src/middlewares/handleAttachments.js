const multer = require("multer");
const path = require("path");
const commonConstants = require("../common/constants");

// Define the storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use path.join to create an absolute path to the uploads directory
        // process.cwd() will resolve to the project root: /home/dev/code
        cb(null, path.join(process.cwd(), commonConstants.ATTACHMENT.DIRECTORY.PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // Sanitize filename to prevent path traversal issues, though multer handles this well.
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9-_\.]/g, '_');
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + safeOriginalName);
    }
});

// Define a secure file filter to allow only specific image types
const fileFilter = (req, file, cb) => {
    // Define a whitelist of allowed MIME types and file extensions
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = /jpeg|jpg|png/;

    // Check both the MIME type and the file extension
    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtensionAllowed = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeAllowed && isExtensionAllowed) {
        cb(null, true); // Accept file
    } else {
        // Pass an error to be caught by the global error handler.
        const error = new Error(commonConstants.ATTACHMENT.ERRORS.INVALID_FILE_TYPE);
        cb(error, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: fileFilter
});

module.exports = upload;

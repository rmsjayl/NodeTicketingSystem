const fs = require('fs').promises;
const commonConstants = require('../common/constants');

/**
 * Middleware to validate uploaded image files by checking their magic numbers (file signatures).
 * This provides a more secure validation than relying solely on MIME types or file extensions,
 * as those can be easily faked by malicious users.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const validateImage = async (req, res, next) => {
    // If no file was uploaded, or if the attachment is optional, proceed.
    // The `createTicket` controller handles whether an attachment is required.
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;

    try {
        // Read the first few bytes of the file as a buffer to check magic numbers.
        // We only need enough bytes to cover the longest magic number (PNG is 8 bytes).
        const buffer = await fs.readFile(filePath, { encoding: null });

        // Define magic numbers for allowed image types (JPEG, PNG)
        const jpegMagic = Buffer.from([0xFF, 0xD8, 0xFF]); // JPEG starts with FF D8 FF
        const pngMagic = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG starts with 89 50 4E 47 0D 0A 1A 0A

        let isValidImage = false;

        if (buffer.length >= jpegMagic.length && buffer.slice(0, jpegMagic.length).equals(jpegMagic)) {
            isValidImage = true; // It's a JPEG
        } else if (buffer.length >= pngMagic.length && buffer.slice(0, pngMagic.length).equals(pngMagic)) {
            isValidImage = true; // It's a PNG
        }

        if (!isValidImage) {
            // If the file's content does not match any allowed image magic number, it's invalid.
            await fs.unlink(filePath); // Delete the potentially malicious or incorrect file
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.ATTACHMENT.CREATE.INVALID_IMAGE,
            });
        }

        next(); // File is valid, proceed to the next middleware/controller
    } catch (error) {
        // Handle errors during file reading or deletion
        if (filePath) {
            try {
                await fs.unlink(filePath); // Attempt to delete the file if an error occurred
            } catch (unlinkError) {
                console.error(`${commonConstants.ATTACHMENT.ERRORS.DELETE_INVALID_FILE} ${filePath}:`, unlinkError);
            }
        }
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${commonConstants.ATTACHMENT.ERRORS.VALIDATE_IMAGE} ${error.message}`,
        });
    }
};

module.exports = validateImage;

const commonConstants = require("../common/constants");
const fs = require("fs");
const path = require("path");

const createUploadDirectory = async () => {
    try {
        // process.cwd() will resolve to the project root: /home/dev/code
        const uploadsDir = path.join(process.cwd(), commonConstants.ATTACHMENT.DIRECTORY.PATH);

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log(`${commonConstants.ATTACHMENT.DIRECTORY.CREATE.SUCCESS} ${uploadsDir}`);
        }

    } catch (error) {
        return `${commonConstants.ATTACHMENT.DIRECTORY.CREATE.FAILED} ${error.message}`
    }

}

module.exports = { createUploadDirectory };
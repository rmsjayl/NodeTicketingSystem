const nodeMailer = require("nodemailer");
const commonHelpers = require("../common/helpers");
const commonConstants = require("../common/constants");

const TEMPLATE_PATHS = {
    [commonConstants.EMAIL_TYPES.ACCOUNT_VERIFICATION]: "../templates/accountVerification.hbs"
}

const sendEmail = async (type, email, subject, user) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        }
    });

    const templatePath = TEMPLATE_PATHS[type];
    if (!templatePath) return;

    const htmlContent = commonHelpers.generateEmailContent(templatePath, user, type);

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: subject,
            html: htmlContent,
        });
        console.log(commonConstants.SEND_EMAIL.SUCCESS)
    } catch (error) {
        return `${commonConstants.SEND_EMAIL.FAILED} ${error.message}`
    }
}

module.exports = sendEmail;
const nodeMailer = require("nodemailer");
const commonHelpers = require("../common/helpers");
const commonConstants = require("../common/constants");

const TEMPLATE_PATHS = {
    [commonConstants.EMAIL_TYPES.ACCOUNT_VERIFICATION]: "../templates/accountVerification.hbs",
    [commonConstants.EMAIL_TYPES.FORGOT_PASSWORD]: "../templates/forgotPassword.hbs",
    [commonConstants.EMAIL_TYPES.CHANGE_ACCOUNT_DETAILS]: "../templates/accountChangeEmailNotif.hbs"
}

const sendEmail = async (receiver, type, subject, data) => {
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

    const htmlContent = commonHelpers.generateEmailFromTemplate(templatePath, receiver, data);

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: receiver,
            subject: subject,
            html: htmlContent,
        });
        console.log(commonConstants.SEND_EMAIL.SUCCESS)
    } catch (error) {
        return `${commonConstants.SEND_EMAIL.FAILED} ${error.message}`
    }
}

module.exports = sendEmail;
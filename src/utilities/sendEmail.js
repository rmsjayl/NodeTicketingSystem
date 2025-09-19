const nodeMailer = require("nodemailer");
const commonConstants = require("../common/constants");

const sendEmail = async (email, subject) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            }
        });

        return await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: subject,
            html: "<b>Hello world?</b>",
        });

    } catch (error) {
        return commonConstants.SEND_EMAIL.FAILED + error.message
    }
}

module.exports = sendEmail;
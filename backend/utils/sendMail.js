const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Check Gmail connection
        await transporter.verify();

        console.log("Email server is ready");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info.messageId);

        return true;

    } catch (error) {

        console.error("Email sending failed:");
        console.error(error);

        return false;
    }
};

module.exports = sendMail;
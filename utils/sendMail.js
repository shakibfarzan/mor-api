const nodemailer = require('nodemailer');

module.exports = (email, subject, html) => {
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        ignoreTLS: true,
        tls: {
            rejectUnauthorized: false
        }
    })

    const sender = "Masters of Rocket";
    const mailOptions = {
        from: sender,
        to: email,
        subject: subject,
        html: html
    }

    transport.sendMail(mailOptions, (err, info) => {
        (err) ? console.log(err) : console.log("Message Sent!")
    })
}
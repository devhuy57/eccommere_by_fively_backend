require('dotenv').config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");
const { convert } = require("html-to-text");
const juice = require("juice");

// Step 1
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


let sendMail = function ({
    template: templateName,
    templateVars,
    ...restOfOptions
}) {
    const templatePath = `server/templates/mail/${templateName}.html`;
    const options = {
        from: process.env.EMAIL,
        ...restOfOptions,
    };

    if (templateName && fs.existsSync(templatePath)) {
        const template = fs.readFileSync(templatePath, "utf-8");
        const html = ejs.render(template, templateVars);
        const htmlWithStylesInlined = juice(html);
        options.html = htmlWithStylesInlined;
    }

    return smtpTransport.sendMail(options);
};

module.exports = {
    sendMail
}
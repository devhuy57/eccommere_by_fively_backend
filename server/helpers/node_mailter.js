require('dotenv').config();
let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');
let events = require('events')
// Step 1
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Step 2
smtpTransport.use('hbs', hbs({
    viewEngine: 'express-handlebars',
    extname: "hbs",
    defaultLayout: false,
    viewPath: 'views/mail',
    layoutsDir: 'views/mail',
}));


// Step 3
let mailOptions = {
    from: process.env.EMAIL,
    to: 'fxhuytran99@gmail.com',
    subject: 'Nodemailer - Test',
    text: 'Wooohooo it works!!',
    template: 'password_change',
    context: {
        name: 'Accime Esterling'
    } // send extra values to template
};


let senMail = function (from, to, subject, template) {
    return new Promise(function (resolve, reject) {
        var options = {
            from: from,
            to: to,
            subject: subject,
            template: template
        }
        smtpTransport.sendMail(options, function (err, success) {
            if (err) reject(Error(`${err}`))
            if (success) resolve(success)
        });
    })
};

module.exports = {
    senMail
}
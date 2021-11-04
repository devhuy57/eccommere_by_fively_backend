let { workerData, parentPort, isMainThread, Worker } = require('worker_threads');
const { sendMail } = require('../helpers/node_mailter');
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


if (isMainThread) {
    module.exports = ({
        template: templateName,
        templateVars,
        ...restOfOptions
    }) => {
        return new Promise((resolve, reject) => {

            const options = {
                from: process.env.EMAIL,
                ...restOfOptions,
            };

            let worker = new Worker(__filename, {
                workerData: {
                    templateName, templateVars, options
                }
            })

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(
                        `Stopped the Worker Thread with the exit code: ${code}`));
            })
        })
    }
} else {
    let options = workerData.options
    const templatePath = `server/templates/mail/${workerData.templateName}.html`;

    if (workerData.templateName && fs.existsSync(templatePath)) {
        const template = fs.readFileSync(templatePath, "utf-8");
        const html = ejs.render(template, workerData.templateVars);
        const htmlWithStylesInlined = juice(html);
        options.html = htmlWithStylesInlined;
    }

    smtpTransport.sendMail(options);
    parentPort.postMessage(
        { fileName: workerData, status: 'Done' })
}


const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
    apiKey: "05a153be",
    apiSecret: "M5GqSyvE7VVhr0so"
})

const from = "84702637656"
const to = "84702637656"
const text = 'A text message sent using the Vonage SMS API'


let sendSMS = async () => {
    await vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if (responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}

module.exports = {
    sendSMS
}
let { workerData, parentPort, isMainThread, Worker } = require('worker_threads');

const { FCM_SERVER_KEY } = require('../configs/app_config');
var FCM = require('fcm-node');
var serverKey = FCM_SERVER_KEY;
var fcm = new FCM(serverKey);

if (isMainThread) {
    module.exports = (message, token) => {
        return new Promise((resolve, reject) => {

            let worker = new Worker(__filename, {
                workerData: {
                    message,
                    token,
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
    var message = {
        to: token,
        notification: {
            title: 'NotifcatioTestAPP',
            body: '{"Message from node js app"}',
        },

        data: { //you can send only notification or only data(or include both)
            title: 'ok cdfsdsdfsd',
            body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
        }

    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!" + err);
            console.log("Respponse:! " + response);
            parentPort.postMessage(
                { fileName: workerData, status: 'error' })
        } else {
            // showToast("Successfully sent with response");
            console.log("Successfully sent with response: ", response);
            parentPort.postMessage(
                { fileName: workerData, status: 'Done' })
        }

    });
}
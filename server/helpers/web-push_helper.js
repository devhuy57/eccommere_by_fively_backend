const webpush = require('web-push');
var crypto = require('crypto');
const subscriptions = {};
const fakeDatabase = []

const publicKey =
    'BO4WXe6IcwE1RgWsN3cb8jE6PJMP7wF95TXM6sBya47YKwIxN2fQL-WnPhEkfFFCNHGZgqT8dwVE-pcp121gVVY';
const privateKey = '-JqCgNSZhtES_0nXPGgJ2bAbpT9yda7nZidRKrdorHk';

const sub = {
    endpoint:
        'https://fcm.googleapis.com/fcm/send/cWcv1sS0Ea8:APA91bE04rsxL3C9OR7VDT8iNNy1wnkLUhfdjhfdfhjGq3qlJX-DYkE7Gm9IYAhHVKdqEpkxjoO1ZY75ljclawWW9VtfWt9M56rfkBUPD25egHoRCWPf3yBD8daER71PayRM4mzPi30w',
    expirationTime: null,
    keys: {
        p256dh:
            'BDo85DDt4k4XrNhlEQG6qaJkYuWewm7kLNk8LZ7fdkfjdk-CUeGvrQGvZorJuS96X-U1P9J7Tn3uBxNNtsdgY0',
        auth: 'x3Q6AeNsZyfjdkf7lkTQRQ',
    },
};

webpush.setVapidDetails('mailto:fxhuytran99@gmail.com', publicKey, privateKey);

function createHash(input) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(Buffer.from(input));
    return res.status(202).json(md5sum.digest('hex'));
}

function handlePushNotificationSubscription(req, res) {
    const subscription = req.body
    fakeDatabase.push(subscription)
    console.log('subscription:', subscription)
}

function sendPushNotification(req, res) {
    const subscriptionId = req.params.id;
    const pushSubscription = subscriptions[subscriptionId];
    webpush
        .sendNotification(
            pushSubscription,
            JSON.stringify({
                title: 'New Product Available ',
                text: 'HEY! Take a look at this brand new t-shirt!',
                image: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
                tag: 'new-product',
                url: '/new-product-jason-leung-HM6TMmevbZQ-unsplash.html'
            })
        )
        .catch((err) => {
            console.log(err);
        });

    res.status(202).json({});
}

let sendNofification = (req, res) => {
    const notificationPayload = {
        notification: {
            title: 'New Notification',
            body: 'This is the body of the notification',
            icon: 'assets/icons/icon-512x512.png',
        },
    }

    const promises = []
    fakeDatabase.forEach(subscription => {
        promises.push(
            webpush.sendNotification(
                subscription,
                JSON.stringify(notificationPayload)
            )
        )
    })
    Promise.all(promises).then(() => res.sendStatus(200))
}
module.exports = { handlePushNotificationSubscription, sendPushNotification, sendNofification };

// webpush.sendNotification(sub, JSON.stringify(payLoad));

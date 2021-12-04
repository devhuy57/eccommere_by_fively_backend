let express = require('express')
let logger = require('morgan')
let { PORT } = require('./configs/app_config')
let app = express()
let DBConnection = require('./configs/app_database')
var cors = require('cors')
const FcmNotification = require('./threads/fcm_notification_thread')
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

io.on('connection', async (socket) => {

    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('my message', async (data) => {
        console.log('data:', data)
        await FcmNotification(data.message, data.token)
        console.log('message: ' + data.message);
    });
});

DBConnection()
app.use(logger('dev'))
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
// app.use(upload.array());
app.use('/uploads', express.static('./uploads'));

// routers
let authRouter = require('./routers/auth_router')
let userRouter = require('./routers/user_router')
let categoryRouter = require('./routers/category_router')
let productRouter = require('./routers/product_router')
let cartRouter = require('./routers/cart_router')
const { handlePushNotificationSubscription, sendPushNotification, sendNofification } = require('./helpers/web-push_helper')
// 
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/products", productRouter)
app.post('/subscription', handlePushNotificationSubscription);
app.post('/sendNotification', async (req, res) => {
    await FcmNotification("Done")
    res.send("Done")
});

// 

// Catch 404 Errors and forward them to error controller
app.use((req, res, next) => {
    let err = new Error("Not Found!")
    err.status = 404
    next(err)
})

// error handle function    
app.use((err, req, res, next) => {
    let error = app.get('env') === 'development' ? err : ""
    let status = err.status || 500
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})
// console.log(webpush.generateVAPIDKeys());

// Start server
// app.listen(PORT, "192.168.3.20")
// app.listen(PORT, "192.168.1.92")
server.listen(PORT)


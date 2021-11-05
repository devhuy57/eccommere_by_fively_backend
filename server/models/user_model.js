let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')
let Schema = mongoose.Schema

let userSchema = new Schema({
    firstName: {
        type: String,
        lowercase: true
    },
    lastName: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    provider: [{
        providerName: {
            type: String,
            default: "local",
        },
        providerID: {
            type: String,
        }
    }],
    phoneNumber: {
        type: String,
        unique: true,
        maxlength: 10,
        minlength: 10,
        default: "",
    },
    address: {
        type: Array,

    },
    payments: [{
        payment_type: {
            type: String,
        },
        paymentNumber: {
            type: String
        }
    }],
    reviews: {
        type: Array,
    },
    avatar: {
        type: String,
        default: "",
    },
    carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }],
    emailCode: {
        type: String,
        length: 6
    },
    emailExpired: {
        type: Date,
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "products"
    }],
    emailVerified: {
        type: Date,
        default: null,
    },
    phoneVerified: {
        type: Date,
        default: null,
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }],
    roles: {
        type: String,
        enum: ["user", "admin", "customer"],
        default: "user"
    },
    logical_delete: {
        type: Date,
        default: null
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
            delete ret.logical_delete
            delete ret.code
            delete ret.expriod
            return ret;
        },
    }
})

// custom server
userSchema.pre('save', async function (next) {
    try {
        if (this.provider.length <= 0) {
            let salt = await bcrypt.genSalt(10)
            let passwordHased = await bcrypt.hash(this.password, salt)
            this.password = passwordHased
        }
        next()
    } catch (error) {
        next(error)
    }
})

// custom server
userSchema.pre('findOneAndUpdate', async function (next) {
    let update = { ...this.getUpdate() };
    try {
        if (update.password) {
            let salt = await bcrypt.genSalt(10)
            update.password = await bcrypt.hash(this.getUpdate().password, salt)
            this.setUpdate(update);
        }
        next()
    } catch (error) {
        next(error)
    }
})


userSchema.pre('find', async function (docs) {
    this.populate('favorites')
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error)
    }
};

// 
let UserModel = mongoose.model('users', userSchema)
module.exports = UserModel
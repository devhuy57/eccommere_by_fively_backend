let passport = require('passport')
let JwtStrategy = require('passport-jwt').Strategy
let LocalStrategy = require('passport-local').Strategy
let { ExtractJwt } = require('passport-jwt')
let { PASSPORT_SERECT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../configs/app_config')
let UserModel = require('../models/user_model')
let GooglePlushTokenStrategy = require('passport-google-plus-token')
// 

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: PASSPORT_SERECT
}, async (payload, done) => {
    try {
        let user = await UserModel.findById(payload.sub, {password:0, __v: 0})
        if (!user) return done(null, false)

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

// passort google
passport.use(new GooglePlushTokenStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
}, async (assessToken, refreshToken, profile, done) => {
    try {
        // check whether this current user exists in database
        const user = await UserModel.findOne({ providerGoogle: profile.id, provider: 'google' })

        if (user) return done(null, user)

        const newUser = await new UserModel({
            provider: 'google',
            providerGoogle: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
        })
        await newUser.save()
        done(null, newUser)
    } catch (error) {
        done(error, false)
    }
}))

// passport localStrategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        let user = await UserModel.findOne({ email })
        if (!user) return done(null, false)
        let isCorrectPassword = await user.comparePassword(password)
        if (!isCorrectPassword) return done(null, false)

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))
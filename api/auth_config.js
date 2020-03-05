require('dotenv').config()

const LocalStrategy = require('passport-local').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

import { User } from './models'

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'No such user' })
        user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err)
          if (!isMatch) return done(null, false, { message: 'Incorrect password' })
          done(null, user)
        })
      })
    }
  ))
  
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    passReqToCallback: true,
    includeEmail: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOne({ twitter: profile.id }, (err, user) => {
      if (err) return done(err)
      if (!user) {
        User.findOne({ email: req.session.authUser.email }, (error, authUser) => {
          if (error) return done(error)
          if (!authUser) return done(null, false, { message: 'No such user' })
          authUser.twitter = profile.id
          authUser.save(err => {
            return done(null, false, { message: 'Duplicated Twitter OAuth data'})
          })
        })
      }
      done(null, user)
    })
  }))
 
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    includeEmail: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOne({ google: profile.id }, (err, user) => {
      if (err) return done(err)
      if (!user) {
        User.findOne({ email: req.session.authUser.email }, (error, authUser) => {
          if (error) return done(error)
          if (!authUser) return done(null, false, { message: 'No such user' })
          authUser.google = profile.id
          authUser.save(err => {
            return done(null, false, { message: 'Duplicated Google OAuth data'})
          })
        })
      }
      done(null, user)
    })
  }))
}
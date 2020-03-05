require('dotenv').config()

import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import mongoose from 'mongoose'
import morgan from 'mongoose-morgan'

const MongoStore = require('connect-mongo')(session)
const app = express()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise

morgan.token('session-username', function (req, res) {
  if (req.session.authUser) return req.session.authUser.username
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan(
  { connectionString: process.env.MONGO_URL },
  { skip: function (req, res) { return req.method === 'GET' } },
  ':session-username|:method|:url|:status|:referrer|:user-agent|:req[x-forwarded-for]'
))

require('./auth_config')(passport)

import router from './routes'
import authRouter from './routes/auth'

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

app.use('/api', router)
app.use(authRouter)

module.exports = app
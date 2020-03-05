import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/auth/twitter', (req, res, next) => {
  passport.authenticate('twitter')(req, res, next)
})

router.get('/auth/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })(req, res, next)
})

router.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }))

router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }))

export default router
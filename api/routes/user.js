require('dotenv').config()

import { Router } from 'express'
import passport from 'passport'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import async from 'async'
import mailgun from 'nodemailer-mailgun-transport'

const router = Router()

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API,
    domain: process.env.ROOT_DOMAIN
  }
}

const nodemailerMailgun = nodemailer.createTransport(mailgun(auth))

import { User } from '../models'

router.post('/register', (req, res, next) => {
  const { email, password, username, role } = req.body
  if (!email || !password || !username) return res.status(400).json({ message: '모든 필드를 입력해주세요.'})
  const user = new User({email, password, username, role})
  user.save(err => {
    if (err) {
      console.log(err)
      return res.status(409).json({ message: '이메일 혹은 닉네임이 이미 존재합니다.'})
    }
    req.logIn(user, (err) => {
      if (err) return res.sendStatus(500)
      user.password = undefined
      req.session.authUser = req.user
      res.json(user)
    })
  })
})

router.post('/signin', passport.authenticate('local'), (req, res, next) => {
  req.user.password = undefined
  req.session.authUser = req.user
  res.json(req.user)
})

router.post('/signout', (req, res, next) => {
  delete req.session.authUser
  res.json({ ok: true })
})

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        let token = buf.toString('hex')
        done(err, token)
      })
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) return res.status(404).json({ message: '존재하지 않는 계정입니다.' })
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 43200000
        
        user.save(function(err) {
          done(err, token, user)
        })
      })
    },
    function(token, user, done) {
      nodemailerMailgun.sendMail({
        from: {name: '부시로드 성우 정보', address: 'support@seiyuus.com'},
        to: {name: user.username, address: user.email},
        subject: '비밀번호 변경',
        html: `요청하신 비밀번호 변경을 진행하기 위해서 <a href="https://bushiroad.seiyuus.com/reset/${token}">이 링크</a>로 이동하여서 비밀번호 변경해주시기 바랍니다. 링크는 12시간 동안만 존재합니다.<br><br>만약 비밀번호 변경 요청을 하지않았거나 원하시지 않는경우 이 메일을 무시하시면됩니다.`
      }, function (err, info) {
        if (err) return res.status(500).json({ message: '내부서버 오류' })
        else return res.status(200).json({ message: 'success'})
      })
    }
  ], function(err) {
    return res.status(500).json({ message: '내부서버 오류' })
  })
})

router.get('/reset/:token', (req, res, next) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
    if (!user) return res.status(404).json({ message: '유효하지 않거나 만료된 링크입니다.'})
    return res.status(200).json({ message: 'success'})
  })
})

router.post('/reset/:token', (req, res, next) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user, next) => {
    if (!user) return res.status(404).json({ message: '유효하지 않거나 만료된 링크입니다.'})
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.save(err => {
      if (err) return res.status(500).json({ message: '내부서버 오류' })
      nodemailerMailgun.sendMail({
        from: {name: '부시로드 성우 정보', address: 'support@seiyuus.com'},
        to: {name: user.username, address: user.email},
        subject: '비밀번호가 변경되었습니다.',
        html: `요청하신 계정 ${user.email}의 비밀번호 변경이 완료되었습니다!`
      }, function (err, info) {
        if (err) return res.status(500).json({ message: '내부서버 오류' })
        else {
          user.password = undefined
          req.session.authUser = req.user
          res.json(user)
        }
      })
    })
  })
})

export default router
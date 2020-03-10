require('dotenv').config()

import { Router } from 'express'
import nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'

const router = Router()

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API,
    domain: process.env.ROOT_DOMAIN
  }
}

const nodemailerMailgun = nodemailer.createTransport(mailgun(auth))

import { User, Logs } from '../models'
import role from '../middleware/role'

router.post('/admin/mail/all', role(['admin']), (req, res, next) => {
  User.find({}, {_id: 0, password: 0, role: 0}, (err, users) => {
    for (let user of users) {
      nodemailerMailgun.sendMail({
        from: {name: '부시로드 성우 정보', address: 'support@seiyuus.com'},
        to: {name: user.username, address: user.email},
        subject: req.body.subject,
        html: req.body.text
      }, (err, info) => {
        if (err) return res.status(500).json(err)
        res.status(200).end()
      })
    }
  })
})

router.post('/admin/mail/:id', role(['admin']), (req, res, next) => {
  User.findById(req.params.id, {_id: 0, password: 0, role: 0}, (err, user) => {
    nodemailerMailgun.sendMail({
      from: {name: '부시로드 성우 정보', address: 'support@seiyuus.com'},
      to: {name: user.username, address: user.email},
      subject: req.body.subject,
      html: req.body.text
    }, (err, info) => {
      if (err) return res.status(500).json(err)
      res.status(200).end()
    })
  })
})

router.get('/admin/users', role(['admin']), (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(users)
  })
})

router.get('/admin/user/:id', role(['admin']), (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    user.password = undefined
    if (err) return res.status(500).json(err)
    res.status(200).json(user)
  })
})

router.patch('/admin/user/:id', role(['admin']), (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {$set: req.body.data}, {new: true, upsert: true}, (err, user) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

router.delete('/admin/user/:id', role(['admin']), (req, res, next) => {
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

router.get('/admin/logs', role(['admin']), (req, res, next) => {
  Logs.find({}, {_id: 0}, (err, logs) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(logs)
  })
})

export default router
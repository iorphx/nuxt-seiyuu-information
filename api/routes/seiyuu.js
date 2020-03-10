import { Router } from 'express'
const router = Router()
import multer from 'multer'
import fs from 'fs'
import path from 'path'

import { Seiyuu, SeiyuuSpecial } from '../models'
import role from '../middleware/role'

const storageSeiyuu = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/img/seiyuu')
  },
  filename: function (req, file, cb) {
    let name = `seiyuu-${Date.now()}${path.extname(file.originalname)}`
    cb(null, name)
  }
})

const storageSeiyuuSpecial = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/img/seiyuu/special')
  },
  filename: function (req, file, cb) {
    let name = `seiyuu-special-${Date.now()}${path.extname(file.originalname)}`
    cb(null, name)
  }
})

const SeiyuuUpload = multer({ storage: storageSeiyuu })
const SeiyuuUploadSpecial = multer({ storage: storageSeiyuuSpecial })

router.get('/seiyuu/list' , (req, res, next) => {
  Seiyuu.find({}, {_id: 0, birthday: 0, constellation: 0, blood: 0, height: 0, hobbies: 0, specialty: 0, agent: 0, born: 0, links: 0, activities: 0}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/seiyuu/special/:project' , (req, res, next) => {
  SeiyuuSpecial.find({project: req.params.project}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/seiyuu/:name', (req, res, next) => {
  Seiyuu.findOne({name: req.params.name}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.patch('/seiyuu/:id', role(['admin', 'editor']), SeiyuuUpload.single('profileImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  let oldImage
  if (req.file) {
    oldImage = dt.image
    dt.image = `/img/seiyuu/${req.file.filename}`
  }
  Seiyuu.findByIdAndUpdate(req.params.id, {$set: dt}, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (req.file) {
      fs.unlink(`./static${oldImage}`, function(error){
        if (err) return res.status(500).json(error)
      })
    }
    res.status(200).json(data)
  })
})

router.patch('/seiyuu/special/:id', role(['admin', 'editor']), SeiyuuUploadSpecial.single('seiyuuImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  let oldImage
  if (req.file) {
    oldImage = dt.members[req.body.memberIndex].image
    dt.members[req.body.memberIndex].image = `/img/seiyuu/special/${req.file.filename}`
  } else if (req.body.delete && req.body.delete !== 'true') {
    oldImage = req.body.delete
  }
  SeiyuuSpecial.findByIdAndUpdate(req.params.id, {$set: dt}, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (oldImage) {
      fs.unlink(`./static${oldImage}`, function(error){
        if (err) return res.status(500).json(error)
      })
    }
    res.status(200).json(data)
  })
})

router.patch('/seiyuu/special/group/:id', role(['admin', 'editor']), (req, res, next) => {
  SeiyuuSpecial.findByIdAndUpdate(req.params.id, {$set: req.body.data}, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(data)
  })
})

router.delete('/seiyuu/:id', role(['admin', 'editor']), (req, res, next) => {
  Seiyuu.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    fs.unlink(`./static${data.image}`, function(error){
      if (err) return res.status(500).json(error)
    })
    res.status(200).end()
  })
})

router.delete('/seiyuu/special/:id', role(['admin', 'editor']), (req, res, next) => {
  SeiyuuSpecial.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    for (let member in data.members) {
      fs.unlink(`./static${member.image}`, function(error){
        if (err) return res.status(500).json(error)
      })
    }
    res.status(200).end()
  })
})

router.post('/seiyuu', role(['admin', 'editor']), SeiyuuUpload.single('profileImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  if (req.file) dt.image = `/img/seiyuu/${req.file.filename}`
  else dt.image = ''
  const seiyuu = new Seiyuu(dt)
  seiyuu.save(err => {
    if (err) res.status(500).json(err)
    else res.status(200).json(seiyuu)
  })
})

router.post('/seiyuu/special', role(['admin', 'editor']), (req, res, next) => {
  const seiyuu = new SeiyuuSpecial(req.body.data)
  seiyuu.save(err => {
    if (err) res.status(500).json(err)
    else res.status(200).json(seiyuu)
  })
})

export default router

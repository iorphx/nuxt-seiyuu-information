import { Router } from 'express'
const router = Router()
import multer from 'multer'
import fs from 'fs'
import path from 'path'

import { Discography } from '../models'
import role from '../middleware/role'

const storageSong = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/img/discography')
  },
  filename: function (req, file, cb) {
    let name = `song-${Date.now()}${path.extname(file.originalname)}`
    cb(null, name)
  }
})

const SongUpload = multer({ storage: storageSong })

router.get('/discography/list' , (req, res, next) => {
  Discography.find({}, {_id: 0, lyric: 0, lyricist: 0, composer: 0, arrange: 0, release: 0}, {sort: 'artist title'}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/discography/list/:project' , (req, res, next) => {
  Discography.find({project: req.params.project}, {_id: 0, lyric: 0, lyricist: 0, composer: 0, arrange: 0, release: 0}, {sort: 'artist title'}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/discography/:title' , (req, res, next) => {
  Discography.findOne({title: req.params.title}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.post('/discography', role(['admin', 'editor']), SongUpload.single('albumImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  if (req.file) dt.image = `/img/discography/${req.file.filename}`
  else dt.image = ''
  const song = new Discography(dt)
  song.save(err => {
    if (err) res.status(500).json(err)
    else res.status(200).json(song)
  })
})

router.patch('/discography/:id', role(['admin', 'editor']), SongUpload.single('albumImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  let oldImage
  if (req.file) {
    oldImage = dt.image
    dt.image = `/img/discography/${req.file.filename}`
  }
  Discography.findByIdAndUpdate(req.params.id, {$set: dt}, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (req.file) {
      fs.unlink(`./static${oldImage}`, function(error){
        if (err) return res.status(500).json(error)
      })
    }
    res.status(200).json(data)
  })
})

router.delete('/discography/:id', role(['admin', 'editor']), (req, res, ㅜㄷㅌㅅ) => {
  Discography.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    fs.unlink(`./static${data.image}`, function(error){
      if (err) return res.status(500).json(error)
    })
    res.status(200).end()
  })
})

export default router
import { Router } from 'express'
const router = Router()
import multer from 'multer'
import path from 'path'
import axios from 'axios'

const storageTinymce = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/uploads')
  },
  filename: function (req, file, cb) {
    let name = `tinymce-${Date.now()}${path.extname(file.originalname)}`
    cb(null, name)
  }
})

const TinymceUpload = multer({ storage: storageTinymce })

router.post('/upload', TinymceUpload.single('file'), (req, res, next) => {
  res.json({
    "location": '/uploads/' + req.file.filename
  })
})

router.post('/linelive', (req, res, next) => {
  axios.get(req.body.url)
    .then(response => {
      let html = response.data
      res.status(200).json(html)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})
      
export default router
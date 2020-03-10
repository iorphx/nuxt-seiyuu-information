import { Router } from 'express'
const router = Router()
import multer from 'multer'
import fs from 'fs'
import path from 'path'

import { Goods } from '../models'
import role from '../middleware/role'

const storageGoods = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/img/goods')
  },
  filename: function (req, file, cb) {
    let name = `goods-${Date.now()}${path.extname(file.originalname)}`
    cb(null, name)
  }
})

const GoodsUpload = multer({ storage: storageGoods })

router.get('/goods/list', (req, res, next) => {
  Goods.find({}, {_id: 0, description: 0, type: 0, release: 0, link: 0, src: 0}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/goods/list/:project', (req, res, next) => {
   Goods.find({project: req.params.project}, {_id: 0, description: 0, type: 0, release: 0, link: 0}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/goods/:name', (req, res, next) => {
  Goods.findOne({name: req.params.name}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.patch('/goods/:id', role(['admin', 'editor']), GoodsUpload.single('goodsImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  let oldImage
  if (req.file) {
    oldImage = dt.image
    dt.image = `/img/goods/${req.file.filename}`
  }
  Goods.findByIdAndUpdate(req.params.id, {$set: dt}, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (req.file) {
      fs.unlink(`./static${oldImage}`, function(error){
        if (err) return res.status(500).json(error)
      })
    }
    res.status(200).json(data)
  })
})

router.delete('/goods/:id', role(['admin', 'editor']), (req, res, next) => {
  Goods.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    fs.unlink(`./static${data.image}`, function(error){
      if (err) return res.status(500).json(error)
    })
    res.status(200).end()
  })
})

router.post('/goods', role(['admin', 'editor']), GoodsUpload.single('goodsImage'), (req, res, next) => {
  let dt = JSON.parse(req.body.data)
  if (req.file) dt.image = `/img/goods/${req.file.filename}`
  else dt.image = ''
  const goods = new Goods(dt)
  goods.save(err => {
    if (err) res.status(500).json(err)
    else res.status(200).json(goods)
  })
})

export default router
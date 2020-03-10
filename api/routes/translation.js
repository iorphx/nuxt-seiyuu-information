import { Router } from 'express'
const router = Router()

import { Translation } from '../models'
import role from '../middleware/role'

router.get('/translation/list', (req, res, next) => {
  Translation.find({}, (err, info) => {
    if (err) res.status(500).json(err)
    else res.status(200).json(info)
  })
})

router.get('/translation/list/:project', (req, res, next) => {
  Translation.find({project: req.params.project}, {sort: 'date'}, (err, info) => {
    if (err) res.status(500).json(err)
    else res.status(200).json(info)
  })
})

router.get('/translation/:id', (req, res, next) => {
  Translation.findById(req.params.id, (err, info) => {
    if (err) res.status(500).json(err)
    else res.status(200).json(info)
  })
})

router.post('/translation', role(['admin', 'editor']), (req, res, next) => {
  const translation = new Translation(req.body.data)
  translation.save(err => {
    if (err) res.status(500).json(err)
    else res.status(200).json(translation)
  })
})

router.patch('/translation/:id', role(['admin', 'editor']), (req, res, next) => {
  Translation.findByIdAndUpdate(req.params.id, {$set: req.body.data}, {upsert: true, new: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(data)
  })
})

router.delete('/translation/:id', role(['admin', 'editor']), (req, res, next) => {
  Translation.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

export default router
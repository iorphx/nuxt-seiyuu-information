import { Router } from 'express'
const router = Router()

import { KaraokeSpecial } from '../models'
import role from '../middleware/role'

router.get('/karaoke/:project', (req, res, next) => {
  KaraokeSpecial.find({project: req.params.project}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(data)
  })
})

router.get('/karaoke/:project/:title', (req, res, next) => {
  KaraokeSpecial.findOne({title: req.params.title, project: req.params.project}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.post('/karaoke', role('admin' || 'editor'), (req, res, next) => {
  const karaoke = new KaraokeSpecial(req.body.data)
  karaoke.save(err => res.sendStatus(err ? 500 : 200))
})

router.put('/karaoke/:id', role('admin' || 'editor'), (req, res, next) => {
  KaraokeSpecial.findByIdAndUpdate(req.params.id, req.body.data, {upsert:true, new:true}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

router.delete('/karaoke/:id', role('admin' || 'editor'), (req, res, next) => {
  KaraokeSpecial.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

export default router
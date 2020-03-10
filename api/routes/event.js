import { Router } from 'express'
const router = Router()

import { Events } from '../models'
import role from '../middleware/role'

router.get('/event', (req, res, next) => {
  Events.find({}, {_id: 0}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.get('/event/:project', (req, res, next) => {
  Events.find({'extendedProps.project': req.params.project}, {_id: 0}, (err, info) => {
    if (err) return res.status(500).json(err)
    res.status(200).json(info)
  })
})

router.post('/event', role(['admin', 'editor']), (req, res, next) => {
  const calendar = new Events(req.body.data)
  calendar.save(err => res.sendStatus(err ? 500 : 200))
})

router.patch('/event/:id', role(['admin', 'editor']), (req, res, next) => {
  Events.findOneAndUpdate({'extendedProps.idx': req.params.id}, {$set: req.body.data}, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

router.delete('/event/:id', role(['admin', 'editor']), (req, res, next) => {
  Events.findOneAndDelete({'extendedProps.idx': req.params.id}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

export default router
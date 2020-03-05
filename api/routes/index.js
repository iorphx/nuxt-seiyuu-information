import { Router } from 'express'
const router = Router()

import user from './user'
import discography from './discography'
import seiyuu from './seiyuu'
import karaoke from './karaoke'
import goods from './goods'
import event from './event'
import admin from './admin'
import translation from './translation'
import utils from './utils'

router.use(user)
router.use(discography)
router.use(seiyuu)
router.use(karaoke)
router.use(goods)
router.use(event)
router.use(admin)
router.use(translation)
router.use(utils)

export default router
import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/auth.js'
import * as proposalsController from '../controllers/proposals.js'

const router = Router()

router.use(authenticate)

const createSchema = z.object({
  title: z.string().max(255).optional(),
  formData: z.any().optional(),
})

const updateSchema = z.object({
  title: z.string().max(255).optional(),
  formData: z.any().optional(),
  thumbnail: z.string().optional().nullable(),
})

router.get('/', proposalsController.list)
router.get('/:id', proposalsController.getById)
router.post('/', validate(createSchema), proposalsController.create)
router.put('/:id', validate(updateSchema), proposalsController.update)
router.delete('/:id', proposalsController.remove)

export default router

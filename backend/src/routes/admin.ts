import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middlewares/validate.js'
import { authenticate } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/requireRole.js'
import * as adminController from '../controllers/admin.js'

const router = Router()

router.use(authenticate)

// --- Proposals ---
const proposalsRouter = Router({ mergeParams: true })
proposalsRouter.use(requireRole(['MASTER']))
proposalsRouter.get('/', adminController.listAllProposals)
proposalsRouter.get('/:id', adminController.getProposalById)

router.use('/proposals', proposalsRouter)

// --- Users ---
const usersRouter = Router({ mergeParams: true })
usersRouter.use(requireRole(['MASTER', 'GERENTE']))

const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  role: z.enum(['USER', 'GERENTE', 'MASTER']).default('USER'),
})

const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(128).optional(),
})

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'GERENTE', 'MASTER']),
})

usersRouter.get('/', adminController.listUsers)
usersRouter.post('/', validate(createUserSchema), adminController.createUser)
usersRouter.put('/:id', validate(updateUserSchema), adminController.updateUser)
usersRouter.put('/:id/role', requireRole(['MASTER']), validate(updateRoleSchema), adminController.updateUserRole)
usersRouter.delete('/:id', adminController.deleteUser)

router.use('/users', usersRouter)

export default router

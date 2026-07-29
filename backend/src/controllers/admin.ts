import { Request, Response } from 'express'
import * as adminService from '../services/admin.js'

// --- Proposals (MASTER only) ---

export async function listAllProposals(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string | undefined
    const proposals = await adminService.listAllProposals(userId)
    res.json({ proposals })
  } catch (error) {
    console.error('[admin/proposals]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function getProposalById(req: Request, res: Response) {
  try {
    const proposal = await adminService.getProposalById(req.params.id as string)
    if (!proposal) {
      res.status(404).json({ error: 'Proposta não encontrada' })
      return
    }
    res.json({ proposal })
  } catch (error) {
    console.error('[admin/proposals/getById]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

// --- Users ---

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await adminService.listUsers()
    res.json({ users })
  } catch (error) {
    console.error('[admin/users]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    let { name, email, password, role } = req.body

    // GERENTE só pode criar como USER
    if (req.user!.role === 'GERENTE') {
      role = 'USER'
    }

    const user = await adminService.createUser({ name, email, password, role })
    res.status(201).json({ user })
  } catch (error: any) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      res.status(409).json({ error: 'Este email já está cadastrado' })
      return
    }
    console.error('[admin/users/create]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    const user = await adminService.updateUser(req.params.id as string, { name, email, password }, req.user!.role)
    res.json({ user })
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    if (error.message === 'FORBIDDEN_TARGET_ROLE') {
      res.status(403).json({ error: 'Você não pode editar este usuário' })
      return
    }
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      res.status(409).json({ error: 'Este email já está em uso' })
      return
    }
    console.error('[admin/users/update]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function updateUserRole(req: Request, res: Response) {
  // Esta rota só deve ser chamada por MASTER (verificado no middleware)
  try {
    const { role } = req.body
    const user = await adminService.updateUserRole(req.params.id as string, role)
    res.json({ user })
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    console.error('[admin/users/role]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await adminService.deleteUser(req.params.id as string, req.user!.userId, req.user!.role)
    res.json({ ok: true })
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    if (error.message === 'FORBIDDEN_TARGET_ROLE') {
      res.status(403).json({ error: 'Você não pode excluir este usuário' })
      return
    }
    if (error.message === 'LAST_MASTER') {
      res.status(409).json({ error: 'Não é possível excluir o único MASTER do sistema' })
      return
    }
    console.error('[admin/users/delete]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

import { Request, Response } from 'express'
import * as proposalsService from '../services/proposals.js'

export async function list(req: Request, res: Response) {
  try {
    const proposals = await proposalsService.listProposals(req.user!.userId)
    res.json({ proposals })
  } catch (error) {
    console.error('[proposals/list]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const proposal = await proposalsService.getProposal(req.params.id as string, req.user!.userId)
    if (!proposal) {
      res.status(404).json({ error: 'Proposta não encontrada' })
      return
    }
    res.json({ proposal })
  } catch (error) {
    console.error('[proposals/getById]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { formData, title } = req.body
    const proposal = await proposalsService.createProposal(req.user!.userId, formData, title)
    res.status(201).json({ proposal })
  } catch (error) {
    console.error('[proposals/create]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { title, formData, thumbnail } = req.body
    const proposal = await proposalsService.updateProposal(req.params.id as string, req.user!.userId, { title, formData, thumbnail })
    if (!proposal) {
      res.status(404).json({ error: 'Proposta não encontrada' })
      return
    }
    res.json({ proposal })
  } catch (error) {
    console.error('[proposals/update]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const deleted = await proposalsService.deleteProposal(req.params.id as string, req.user!.userId)
    if (!deleted) {
      res.status(404).json({ error: 'Proposta não encontrada' })
      return
    }
    res.json({ ok: true })
  } catch (error) {
    console.error('[proposals/delete]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export async function uploadPdf(req: Request, res: Response) {
  try {
    const data = req.body as Buffer
    if (!Buffer.isBuffer(data) || data.length === 0) {
      res.status(400).json({ error: 'Corpo da requisição deve ser o arquivo PDF' })
      return
    }

    const pdf = await proposalsService.saveProposalPdf(req.params.id as string, req.user!.userId, data)
    if (!pdf) {
      res.status(404).json({ error: 'Proposta não encontrada' })
      return
    }

    res.json({ ok: true, url: `/pdfs/${req.params.id}` })
  } catch (error) {
    console.error('[proposals/uploadPdf]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

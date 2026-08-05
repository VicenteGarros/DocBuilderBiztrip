import { Router } from 'express'
import { getProposalPdf } from '../services/proposals.js'

const router = Router()

router.get('/:proposalId', async (req, res) => {
  try {
    const pdf = await getProposalPdf(req.params.proposalId as string)
    if (!pdf) {
      res.status(404).json({ error: 'PDF não encontrado' })
      return
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="proposta.pdf"')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(Buffer.from(pdf.data))
  } catch (error) {
    console.error('[pdfs/get]', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router

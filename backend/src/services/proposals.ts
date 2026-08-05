import { prisma } from '../lib/prisma.js'

export async function listProposals(userId: string) {
  return prisma.proposal.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      thumbnail: true,
    },
  })
}

export async function getProposal(id: string, userId: string) {
  const proposal = await prisma.proposal.findUnique({ where: { id } })
  if (!proposal || proposal.userId !== userId) {
    return null
  }
  return proposal
}

export async function createProposal(userId: string, formData: any, title?: string) {
  return prisma.proposal.create({
    data: {
      userId,
      title: title || 'Proposta sem título',
      formData: formData || {},
    },
  })
}

export async function updateProposal(id: string, userId: string, data: { title?: string; formData?: any; thumbnail?: string }) {
  const proposal = await prisma.proposal.findUnique({ where: { id } })
  if (!proposal || proposal.userId !== userId) {
    return null
  }

  return prisma.proposal.update({
    where: { id },
    data,
  })
}

export async function deleteProposal(id: string, userId: string) {
  const proposal = await prisma.proposal.findUnique({ where: { id } })
  if (!proposal || proposal.userId !== userId) {
    return false
  }

  await prisma.proposal.delete({ where: { id } })
  return true
}

export async function saveProposalPdf(proposalId: string, userId: string, data: Buffer) {
  const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } })
  if (!proposal || proposal.userId !== userId) {
    return null
  }

  const dataBytes = new Uint8Array(data)
  return prisma.pdf.upsert({
    where: { proposalId },
    update: { data: dataBytes },
    create: { proposalId, data: dataBytes },
  })
}

export async function getProposalPdf(proposalId: string) {
  return prisma.pdf.findUnique({ where: { proposalId } })
}

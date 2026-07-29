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

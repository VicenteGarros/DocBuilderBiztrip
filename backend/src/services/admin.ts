import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

// --- Proposals (MASTER only) ---

export async function listAllProposals(userId?: string) {
  const where = userId ? { userId } : {}
  return prisma.proposal.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  })
}

export async function getProposalById(id: string) {
  return prisma.proposal.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  })
}

// --- Users (MASTER and GERENTE) ---

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: 'USER' | 'GERENTE' | 'MASTER'
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const passwordHash = await bcrypt.hash(data.password, 12)

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; password?: string },
  actorRole: string
) {
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) {
    throw new Error('USER_NOT_FOUND')
  }

  // GERENTE só pode editar usuários USER
  if (actorRole === 'GERENTE' && target.role !== 'USER') {
    throw new Error('FORBIDDEN_TARGET_ROLE')
  }

  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.email !== undefined) {
    // Verificar se o novo email já existe (e não é o mesmo usuário)
    const emailExists = await prisma.user.findFirst({
      where: { email: data.email, id: { not: id } },
    })
    if (emailExists) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
    updateData.email = data.email
  }
  if (data.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12)
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
}

export async function updateUserRole(id: string, newRole: 'USER' | 'GERENTE' | 'MASTER') {
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) {
    throw new Error('USER_NOT_FOUND')
  }

  return prisma.user.update({
    where: { id },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
}

export async function deleteUser(id: string, actorId: string, actorRole: string) {
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) {
    throw new Error('USER_NOT_FOUND')
  }

  // GERENTE só pode excluir usuários USER
  if (actorRole === 'GERENTE' && target.role !== 'USER') {
    throw new Error('FORBIDDEN_TARGET_ROLE')
  }

  // Impedir MASTER de excluir a si mesmo se for o último
  if (id === actorId && actorRole === 'MASTER') {
    const masterCount = await prisma.user.count({ where: { role: 'MASTER' } })
    if (masterCount <= 1) {
      throw new Error('LAST_MASTER')
    }
  }

  await prisma.user.delete({ where: { id } })
}

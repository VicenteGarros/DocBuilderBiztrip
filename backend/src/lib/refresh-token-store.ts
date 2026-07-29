import { prisma } from './prisma.js'

export const refreshTokenStore = {
  async set(tokenId: string, userId: string, ttlMs: number) {
    await prisma.refreshToken.create({
      data: {
        tokenId,
        userId,
        expiresAt: new Date(Date.now() + ttlMs),
      },
    })
  },

  async get(tokenId: string) {
    const token = await prisma.refreshToken.findUnique({ where: { tokenId } })
    if (!token) return null
    if (token.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: token.id } })
      return null
    }
    return { userId: token.userId, expiresAt: token.expiresAt }
  },

  async delete(tokenId: string) {
    await prisma.refreshToken.deleteMany({ where: { tokenId } })
  },

  async deleteAllForUser(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } })
  },

  async cleanup() {
    await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
  },
}

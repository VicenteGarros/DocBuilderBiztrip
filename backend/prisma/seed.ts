import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const email = process.env.SEED_MASTER_EMAIL
  const password = process.env.SEED_MASTER_PASSWORD
  const name = process.env.SEED_MASTER_NAME

  if (!email || !password || !name) {
    console.log('[seed] Variáveis SEED_MASTER_* não definidas — pulando seed.')
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'MASTER' },
    create: {
      name,
      email,
      passwordHash,
      role: 'MASTER',
    },
  })

  console.log(`[seed] Usuário MASTER ${user.email} (${user.id}) pronto.`)
}

seed()
  .catch((e) => {
    console.error('[seed] Erro:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

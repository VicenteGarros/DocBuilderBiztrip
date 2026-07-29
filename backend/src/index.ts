import app from './app.js'
import { env } from './config/env.js'

app.listen(env.PORT, () => {
  console.log(`[server] DocBuilder API rodando em http://localhost:${env.PORT}`)
})

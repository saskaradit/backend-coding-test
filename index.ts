'use strict'
import express, { Request, Response } from 'express'
import logger from './src/config/logger.config'
import config from './src/config/config'
import healthRoute from './src/routes/health'
import rideRoutes from './src/routes/rides'
import swaggerDocs from './src/config/swagger.config'
import swaggerUi from 'swagger-ui-express'

const app = express()

app.use('/rides', rideRoutes)
app.use('/health', healthRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get('*', async (req: Request, res: Response) => {
  res
    .status(404)
    .json({ error_code: 'ROUTE_NOT_FOUND_ERROR', message: 'Not found' })
  logger.log({
    level: 'error',
    message: { error_code: 'ROUTE_NOT_FOUND_ERROR', message: 'Not found' },
  })
})

app.listen(config.port, () => {
  logger.log({
    level: 'info',
    message: `App started and listening on port ${config.port}`,
  })
  console.log(`App started and listening on port ${config.port}`)
})

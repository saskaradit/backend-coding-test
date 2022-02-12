'use strict'
const config = require('./src/config/config')
const express = require('express')
const logger = require('./src/config/logger.config')
const healthRoute = require('./src/routes/health')
const rideRoutes = require('./src/routes/rides')
const app = express()

app.use('/rides', rideRoutes)
app.use('/health', healthRoute)

app.get('*', async (req, res) => {
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

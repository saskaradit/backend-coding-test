'use strict'

const port = 8010

const healthRoute = require('./src/routes/health')
const rideRoutes = require('./src/routes/rides')
const express = require('express')
const logger = require('./src/config/logger.config')

const db = require('./src/config/db.config')
const app = express()

db.initSchema()
app.use('/rides', rideRoutes)
app.use('/health', healthRoute)

app.get('*', async (req, res) => {
  res
    .status(404)
    .json({ error_code: 'ROUTE_NOT_FOUND_ERROR', message: 'Not found' })
  logger.log({
    level: 'error',
    message: `ROUTE_NOT_FOUND_ERROR`,
  })
})

app.listen(port, () => {
  logger.log({
    level: 'info',
    message: `App started and listening on port ${port}`,
  })
  console.log(`App started and listening on port ${port}`)
})

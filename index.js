'use strict'

const port = 8010

const db = require('./src/config/db.config')

const healthRoute = require('./src/routes/health')
// const rideRoutes = require('./src/routes/rides')(db)

const winston = require('winston')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
db.initSchema()

// db.serialize(() => {
//   buildSchemas(db)
// })
const app = require('./src/app')(db.getDB())
app.use(healthRoute)
// app.use('/rides', rideRoutes)

app.get('*', async (req, res) => {
  res.status('404').json({ message: 'Not found' })
})

app.listen(port, () => {
  logger.log({
    level: 'info',
    message: `App started and listening on port ${port}`,
  })
  console.log(`App started and listening on port ${port}`)
})

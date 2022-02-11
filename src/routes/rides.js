'use strict'

const express = require('express')
const route = express.Router()
const bodyParser = require('body-parser')
const db = require('../config/db.config').getDB()
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const jsonParser = bodyParser.json()
const ridesController = require('../controllers/rides.controller')
const validateRequest = require('../middlewares/validateRequest')

route.post(
  '/',
  jsonParser,
  validateRequest,
  asyncMiddleware(ridesController.create)
)

route.get('/', asyncMiddleware(ridesController.fetch))

route.get('/:id', async (req, res) => {
  await db.all(
    `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
    function (err, rows) {
      // if (err) {
      //   return res.send({
      //     error_code: 'SERVER_ERROR',
      //     message: 'Unknown error',
      //   })
      // }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        })
      }

      res.send(rows)
    }
  )
})

module.exports = route

'use strict'

const express = require('express')
const route = express.Router()
const bodyParser = require('body-parser')
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

route.get('/:id', asyncMiddleware(ridesController.get))

module.exports = route

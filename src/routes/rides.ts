'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import * as ridesController from '../controllers/rides.controller'
import validateRequest from '../middlewares/validateRequest'
const route = express.Router()
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const jsonParser = bodyParser.json()

route.post(
  '/',
  jsonParser,
  validateRequest,
  asyncMiddleware(ridesController.create)
)

route.get('/', asyncMiddleware(ridesController.fetch))

route.get('/:id', asyncMiddleware(ridesController.get))

export default route

'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import * as ridesController from '../controllers/rides.controller'
import validateRequest from '../middlewares/validateRequest'
const route = express.Router()
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const jsonParser = bodyParser.json()

/**
 * @swagger
 * /rides:
 *  post:
 *    description: create a new ride
 *    consumes:
 *       - application/json
 *    responses:
 *      '200':
 *        description: a successful response
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *
 *            start_lat:
 *              required: true
 *              type: number
 *              description: startLatitude
 *            start_long:
 *              required: true
 *              type: number
 *              description: startLongitude
 *            end_lat:
 *              required: true
 *              type: number
 *              description: endLatitude
 *            end_long:
 *              required: true
 *              type: number
 *              description: endLongitude
 *            rider_name:
 *              required: true
 *              type: string
 *              description: riderName
 *            driver_name:
 *              required: true
 *              type: string
 *              description: driverName
 *            driver_vehicle:
 *              required: true
 *              type: string
 *              description: driverVehicle
 */

route.post(
  '/',
  jsonParser,
  validateRequest,
  asyncMiddleware(ridesController.create)
)

/**
 * @swagger
 * /rides:
 *  get:
 *    description: get 2 rides per page
 *    responses:
 *      '200':
 *        description: a successful response
 */

route.get('/', asyncMiddleware(ridesController.fetch))

/**
 * @swagger
 * /rides/{rideID}:
 *  get:
 *    description: get a specific
 *    parameters:
 *      - in: path
 *        name: rideID
 *        schmema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: a successful response
 */

route.get('/:id', asyncMiddleware(ridesController.get))

export default route

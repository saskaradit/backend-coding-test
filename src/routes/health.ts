'use strict'

import express, { Request, Response } from 'express'
const route = express.Router()
const asyncMiddleware = require('../middlewares/asyncMiddleware')

/**
 * @swagger
 * /health:
 *  get:
 *    description: Healthcheck for the node
 *    responses:
 *      '200':
 *        description: a successful response
 */

route.get(
  '/',
  asyncMiddleware(async (req: Request, res: Response) => {
    await res.status(200).send('Healthy')
  })
)

export default route

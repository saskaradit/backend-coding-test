'use strict'

const express = require('express')
const route = express.Router()
const asyncMiddleware = require('../middlewares/asyncMiddleware')
route.get(
  '/health',
  asyncMiddleware(async (req, res) => {
    await res.status(200).send('Healthy')
  })
)

module.exports = route

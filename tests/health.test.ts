'use strict'

import request from 'supertest'
import express from 'express'
import healthRoute from '../src/routes/health'
const app = express()
app.use('/health', healthRoute)

describe('Check is the server is running', () => {
  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done)
    })
  })
})

'use strict'

const request = require('supertest')
const assert = require('assert')

const express = require('express')

const healthRoute = require('../src/routes/health')
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

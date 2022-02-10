'use strict'

const request = require('supertest')
const assert = require('assert')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const app = require('../src/app')(db)
const buildSchemas = require('../src/schemas')

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err)
      }

      buildSchemas(db)

      done()
    })
  })

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done)
    })
  })
  describe('Rides API', () => {
    it('should return error message if there is no rides', async () => {
      const response = await request(app).get('/rides').send()
      assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    })
    it('should return error message if the ride is not found', async () => {
      const response = await request(app).get('/rides/10').send()
      assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    })
    it('can create a new ride', async () => {
      const response = await request(app).post('/rides').send({
        start_lat: 71,
        start_long: 100,
        end_lat: 79,
        end_long: 120,
        rider_name: 'Rad',
        driver_name: 'Hans',
        driver_vehicle: 'Ducatti',
      })
      assert.equal(response.body[0].rideID, 1)
    })
  })
})

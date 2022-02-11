'use strict'

const request = require('supertest')
const assert = require('assert')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const app = require('../src/app')(db)
const buildSchemas = require('../src/schemas')
const healthRoute = require('../src/routes/health')
app.use(healthRoute)

const createRide = () => {
  return request(app).post('/rides').send(rider)
}

const rider = {
  start_lat: 71,
  start_long: 100,
  end_lat: 79,
  end_long: 120,
  rider_name: 'Rad',
  driver_name: 'Hans',
  driver_vehicle: 'Ducatti',
}

describe('API tests', () => {
  beforeEach((done) => {
    // Resets the table for each test, also resets the auto_increment to zero
    db.run(`DROP TABLE IF EXISTS rides`, function (err) {
      if (err) {
        return done(err)
      }
    })
    db.serialize((err) => {
      if (err) {
        return done(err)
      }
      buildSchemas(db)
    })
    done()
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
    it('can create a new ride with valid inputs', async () => {
      const response = await request(app).post('/rides').send(rider)
      assert.equal(response.body[0].rideID, 1)
    })
    it('throws an error if startLatitude and startLongitude is not valid', async () => {
      // make sure the copy is deep copy
      const invalidRider = JSON.parse(JSON.stringify(rider))
      invalidRider.start_lat = 92
      invalidRider.start_long = 200
      const response = await request(app).post('/rides').send(invalidRider)
      assert.equal(response.body.error_code, 'VALIDATION_ERROR')
      assert.equal(
        response.body.message,
        'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      )
    })

    it('throws an error if endLatitude and endLongitude is not valid', async () => {
      const invalidRider = JSON.parse(JSON.stringify(rider))
      invalidRider.end_lat = 99
      invalidRider.end_long = 200
      const response = await request(app).post('/rides').send(invalidRider)
      assert.equal(response.body.error_code, 'VALIDATION_ERROR')
      assert.equal(
        response.body.message,
        'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      )
    })
    it('throws an error if riderName is not valid', async () => {
      const invalidRider = JSON.parse(JSON.stringify(rider))
      invalidRider.rider_name = ''
      const response = await request(app).post('/rides').send(invalidRider)
      assert.equal(response.body.error_code, 'VALIDATION_ERROR')
      assert.equal(
        response.body.message,
        'Rider name must be a non empty string'
      )
    })
    it('throws an error if driverName is not valid', async () => {
      const invalidRider = JSON.parse(JSON.stringify(rider))
      invalidRider.driver_name = ''
      const response = await request(app).post('/rides').send(invalidRider)
      assert.equal(response.body.error_code, 'VALIDATION_ERROR')
      assert.equal(
        response.body.message,
        'Driver name must be a non empty string'
      )
    })
    it('throws an error if driverVehicle is not valid', async () => {
      const invalidRider = JSON.parse(JSON.stringify(rider))
      invalidRider.driver_vehicle = ''
      const response = await request(app).post('/rides').send(invalidRider)
      assert.equal(response.body.error_code, 'VALIDATION_ERROR')
      assert.equal(
        response.body.message,
        'Driver vehicle must be a non empty string'
      )
    })

    it('can fetch rides', async () => {
      await createRide()
      await createRide()
      const response = await request(app).get('/rides').send()
      assert.equal(response.body[0].rideID, 1)
      assert.equal(response.body.length, 2)
    })
    it('can get a specific ride', async () => {
      await createRide()
      await createRide()
      const response = await request(app).get('/rides/2').send()
      assert.equal(response.body[0].rideID, 2)
      assert.equal(response.body.length, 1)
    })
    it('can fetch rides on a specific page', async () => {
      await createRide()
      await createRide()
      await createRide()
      await createRide()
      await createRide()
      const response = await request(app).get('/rides?page=2').send()
      assert.equal(response.body[0].rideID, 3)
      assert.equal(response.body.length, 2)
    })
    it('should return error message if the page is empty', async () => {
      const response = await request(app).get('/rides?page=2').send()
      assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    })
  })
})

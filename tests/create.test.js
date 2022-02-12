'use strict'

const request = require('supertest')
const assert = require('assert')

const db = require('../src/config/db.config').getDB()
const express = require('express')

const rideRoutes = require('../src/routes/rides')
const healthRoute = require('../src/routes/health')
const resetDB = require('./setup')
const app = express()
app.use('/health', healthRoute)
app.use('/rides', rideRoutes)

const rider = {
  start_lat: 71,
  start_long: 100,
  end_lat: 79,
  end_long: 120,
  rider_name: 'Rad',
  driver_name: 'Hans',
  driver_vehicle: 'Ducatti',
}

describe('POST /rides', () => {
  beforeEach((done) => {
    // Resets the table for each test, also resets the auto_increment to zero
    resetDB(db, done)
    done()
  })
  describe('Error on client request', () => {
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
  })
  it('can create a new ride with valid inputs', async () => {
    const response = await request(app).post('/rides').send(rider)
    assert.equal(response.body[0].rideID, 1)
  })
})

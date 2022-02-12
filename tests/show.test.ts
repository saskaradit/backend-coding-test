'use strict'

import request from 'supertest'
import assert from 'assert'

import getDB from '../src/config/db.config'
const db = getDB()
import express from 'express'

import rideRoutes from '../src/routes/rides'
const app = express()
import resetDB from './setup'
app.use('/rides', rideRoutes)

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

describe('GET /rides/:id', () => {
  beforeEach((done) => {
    // Resets the table for each test, also resets the auto_increment to zero
    resetDB(db, done)
    done()
  })

  describe('Error message', () => {
    it('should return error message if the ride is not found', async () => {
      const response = await request(app).get('/rides/10').send()
      assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    })
  })
  it('can get a specific ride', async () => {
    await createRide()
    await createRide()
    const response = await request(app).get('/rides/2').send()
    assert.equal(response.body[0].rideID, 2)
    assert.equal(response.body.length, 1)
  })
  it('throws an error if driver not found', async () => {
    await createRide()
    const response = await request(app).get('/rides/2').send()
    assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    assert.equal(response.body.message, 'Could not find any rides')
  })
  it('tries to sql inject', async () => {
    await createRide()
    const response = await request(app).get('/rides/drop table rides;').send()
    assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    assert.equal(response.body.message, 'Could not find any rides')
  })
})

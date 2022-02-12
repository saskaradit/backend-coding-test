'use strict'

import request from 'supertest'
import assert from 'assert'
import express from 'express'
import getDB from '../src/config/db.config'
const db = getDB()

import rideRoutes from '../src/routes/rides'
const app = express()
import resetDB from './setup'
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
const createRide = () => {
  return request(app).post('/rides').send(rider)
}

describe('GET /rides', () => {
  beforeEach((done) => {
    // Resets the table for each test, also resets the auto_increment to zero
    resetDB(db, done)
    done()
  })
  describe('Error on GET', () => {
    it('should return error message if there is no rides', async () => {
      const response = await request(app).get('/rides').send()
      assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    })
    it('should return error message if the page is empty', async () => {
      const response = await request(app).get('/rides?page=2').send()
      assert.equal(response.body.error_code, 'RIDES_NOT_FOUND_ERROR')
    })
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
})

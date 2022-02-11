'use strict'

const express = require('express')
const app = express.Router()
const bodyParser = require('body-parser')
const db = require('../config/db.config').getDB()
const jsonParser = bodyParser.json()

app.post('/rides', jsonParser, async (req, res) => {
  const startLatitude = Number(req.body.start_lat)
  const startLongitude = Number(req.body.start_long)
  const endLatitude = Number(req.body.end_lat)
  const endLongitude = Number(req.body.end_long)
  const riderName = req.body.rider_name
  const driverName = req.body.driver_name
  const driverVehicle = req.body.driver_vehicle

  if (
    startLatitude < -90 ||
    startLatitude > 90 ||
    startLongitude < -180 ||
    startLongitude > 180
  ) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message:
        'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    })
  }

  if (
    endLatitude < -90 ||
    endLatitude > 90 ||
    endLongitude < -180 ||
    endLongitude > 180
  ) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message:
        'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    })
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    })
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Driver name must be a non empty string',
    })
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Driver vehicle must be a non empty string',
    })
  }

  var values = [
    req.body.start_lat,
    req.body.start_long,
    req.body.end_lat,
    req.body.end_long,
    req.body.rider_name,
    req.body.driver_name,
    req.body.driver_vehicle,
  ]

  const result = await db.run(
    'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
    values,
    function (err) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        })
      }

      db.all(
        'SELECT * FROM Rides WHERE rideID = ?',
        this.lastID,
        function (err, rows) {
          if (err) {
            return res.send({
              error_code: 'SERVER_ERROR',
              message: 'Unknown error ' + err,
            })
          }

          res.send(rows)
        }
      )
    }
  )
})

app.get('/rides', async (req, res) => {
  // default page to 1
  const query = req.query.page ? req.query.page : 1
  const currPage = (query - 1) * 2
  // using offset on db reduces performance drastically
  await db.all(
    `SELECT * FROM Rides WHERE rideId > ${currPage} ORDER BY rideID LIMIT 2`,
    function (err, rows) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error ' + err,
        })
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        })
      }

      res.send(rows)
    }
  )
})

app.get('/rides/:id', async (req, res) => {
  await db.all(
    `SELECT * FROM Rides WHERE rideID='${req.params.id}'`,
    function (err, rows) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        })
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        })
      }

      res.send(rows)
    }
  )
})

module.exports = app
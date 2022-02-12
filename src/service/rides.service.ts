import getDB from '../config/db.config'
const db = getDB()
import logger from '../config/logger.config'
import Ride from '../models/ride'
import config from '../config/config'

async function create(ride: Ride) {
  var values = [
    ride.startLatitude,
    ride.startLongitude,
    ride.endLatitude,
    ride.endLongitude,
    ride.riderName,
    ride.driverName,
    ride.driverVehicle,
  ]
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      function (err: Error) {
        if (err) {
          reject({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          })
          logger.log({
            level: 'error',
            message: {
              error_code: 'SERVER_ERROR',
              message: 'Unknown error',
            },
          })
        }
        db.all(
          'SELECT * FROM Rides WHERE rideID = ?',
          // @ts-ignore
          this.lastID,
          function (err: Error, rows: Array<JSON>) {
            if (err) {
              reject({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error ' + err,
              })
              logger.log({
                level: 'error',
                message: {
                  error_code: 'SERVER_ERROR',
                  message: 'Unknown error',
                },
              })
            }
            resolve(rows)
          }
        )
      }
    )
  })
}

async function fetch(page = 0) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Rides WHERE rideId > ? ORDER BY rideID LIMIT ?`,
      page,
      config.limitRecord,
      function (err: Error, rows: Array<JSON>) {
        if (err) {
          reject({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error ' + err,
          })
          logger.log({
            level: 'error',
            message: {
              error_code: 'SERVER_ERROR',
              message: 'Unknown error ' + err,
            },
          })
        }
        if (rows.length === 0) {
          reject({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          })
        }
        resolve(rows)
      }
    )
  })
}

async function get(id: Number) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Rides WHERE rideID=?`,
      id,
      function (err: Error, rows: Array<JSON>) {
        if (err) {
          reject({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          })
          logger.log({
            level: 'error',
            message: {
              error_code: 'SERVER_ERROR',
              message: 'Unknown error ' + err,
            },
          })
        }
        if (rows.length === 0) {
          reject({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          })
        }
        resolve(rows)
      }
    )
  })
}

export default { create, fetch, get }

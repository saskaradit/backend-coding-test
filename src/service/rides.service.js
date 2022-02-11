const db = require('../config/db.config').getDB()
const logger = require('../config/logger.config')
const config = require('../config/config')

async function create(ride) {
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
      function (err) {
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
          this.lastID,
          function (err, rows) {
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
      function (err, rows) {
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

async function get(id) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Rides WHERE rideID=?`, id, function (err, rows) {
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
    })
  })
}

module.exports = {
  create,
  fetch,
  get,
}

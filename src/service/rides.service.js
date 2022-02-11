const db = require('../config/db.config').getDB()
const logger = require('../config/logger.config')

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
  let result
  const response = new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      function (err) {
        if (err) {
          result = {
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          }
          logger.log({
            level: 'error',
            message: result,
          })
        }

        db.all(
          'SELECT * FROM Rides WHERE rideID = ?',
          this.lastID,
          function (err, rows) {
            if (err) {
              result = {
                error_code: 'SERVER_ERROR',
                message: 'Unknown error ' + err,
              }
              logger.log({
                level: 'error',
                message: result,
              })
            } else {
              result = rows
            }
            resolve()
          }
        )
      }
    )
  })
  await response
  return result
}

async function fetch(page = 0) {
  let result
  const response = new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Rides WHERE rideId > ${page} ORDER BY rideID LIMIT 2`,
      function (err, rows) {
        if (err) {
          result = {
            error_code: 'SERVER_ERROR',
            message: 'Unknown error ' + err,
          }
          logger.log({
            level: 'error',
            message: result,
          })
        }

        if (rows.length === 0) {
          result = {
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          }
        } else {
          result = rows
        }
        resolve()
      }
    )
  })
  await response
  return result
}

async function get(id) {
  let result
  const response = new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${id}'`, function (err, rows) {
      if (err) {
        result = {
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        }
        logger.log({
          level: 'error',
          message: result,
        })
      }

      if (rows.length === 0) {
        result = {
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        }
      } else {
        result = rows
      }
      resolve()
    })
  })
  await response
  return result
}

module.exports = {
  create,
  fetch,
  get,
}

const db = require('../config/db.config').getDB()

async function create(
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude,
  riderName,
  driverName,
  driverVehicle
) {
  var values = [
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    riderName,
    driverName,
    driverVehicle,
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
        }

        if (rows.length === 0) {
          result = {
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          }
        } else {
          result = rows
        }
        console.log(result)
        resolve()
      }
    )
  })
  await response
  return result
}

module.exports = {
  create,
  fetch,
}

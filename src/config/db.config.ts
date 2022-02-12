'use strict'
const sqlite3 = require('sqlite3').verbose()
let db: typeof sqlite3

const createRideTableSchema = `
        CREATE TABLE Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
        startLat DECIMAL NOT NULL,
        startLong DECIMAL NOT NULL,
        endLat DECIMAL NOT NULL,
        endLong DECIMAL NOT NULL,
        riderName TEXT NOT NULL,
        driverName TEXT NOT NULL,
        driverVehicle TEXT NOT NULL,
        created DATETIME default CURRENT_TIMESTAMP
        )
    `

const getDB = () => {
  if (db) {
    return db
  } else {
    db = new sqlite3.Database(':memory:')
    db.serialize(() => {
      db.run(createRideTableSchema)
    })
    return db
  }
}

export default getDB

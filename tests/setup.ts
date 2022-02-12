// const db = require('../src/config/db.config')

const resetDB = (db: any, done: Mocha.Done) => {
  // Resets the table for each test, also resets the auto_increment to zero
  db.run(`DROP TABLE IF EXISTS rides`, function (err: Error) {
    if (err) {
      return done(err)
    }
  })
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
  db.serialize((err: Error) => {
    if (err) {
      return done(err)
    }
    db.run(createRideTableSchema)
  })
}
module.exports = resetDB
export default resetDB

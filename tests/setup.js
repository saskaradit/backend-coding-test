// const db = require('../src/config/db.config')

const resetDB = (db, done) => {
  // Resets the table for each test, also resets the auto_increment to zero
  db.getDB().run(`DROP TABLE IF EXISTS rides`, function (err) {
    if (err) {
      return done(err)
    }
  })
  db.getDB().serialize((err) => {
    if (err) {
      return done(err)
    }
    db.initSchema()
  })
}
module.exports = resetDB

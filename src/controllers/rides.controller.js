const ridesService = require('../service/rides.service')

async function create(req, res) {
  const startLatitude = Number(req.body.start_lat)
  const startLongitude = Number(req.body.start_long)
  const endLatitude = Number(req.body.end_lat)
  const endLongitude = Number(req.body.end_long)
  const riderName = req.body.rider_name
  const driverName = req.body.driver_name
  const driverVehicle = req.body.driver_vehicle
  try {
    res.send(
      await ridesService.create(
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
        riderName,
        driverName,
        driverVehicle
      )
    )
  } catch (err) {
    console.error(`Error while creating new rides`, err.message)
  }
}

async function fetch(req, res) {
  // default page to 1
  const query = req.query.page ? req.query.page : 1
  const currPage = (query - 1) * 2
  // using offset on db reduces performance drastically
  try {
    res.send(await ridesService.fetch(currPage))
  } catch (error) {
    console.error('Error while fetching')
  }
}

module.exports = { create, fetch }

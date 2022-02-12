const ridesService = require('../service/rides.service')
const Ride = require('../models/ride')
const logger = require('../config/logger.config')

async function create(req, res) {
  const startLatitude = Number(req.body.start_lat)
  const startLongitude = Number(req.body.start_long)
  const endLatitude = Number(req.body.end_lat)
  const endLongitude = Number(req.body.end_long)
  const riderName = req.body.rider_name
  const driverName = req.body.driver_name
  const driverVehicle = req.body.driver_vehicle
  try {
    const ride = new Ride(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      riderName,
      driverName,
      driverVehicle
    )
    const response = await ridesService.create(ride)
    res.set('content-type', 'application/json').send(response)
    logger.log({
      level: 'info',
      message: response,
    })
  } catch (err) {
    res.send(err)
    logger.log({
      level: 'error',
      message: `Error while creating a new ride`,
    })
  }
}

async function fetch(req, res) {
  // default page to 1
  const query = req.query.page ? req.query.page : 1
  const currPage = (query - 1) * 2
  // using offset on db reduces performance drastically
  try {
    res
      .set('content-type', 'application/json')
      .send(await ridesService.fetch(currPage))
  } catch (error) {
    res.send(error)
    logger.log({
      level: 'error',
      message: `Error while fetching`,
    })
  }
}

async function get(req, res) {
  const id = req.params.id
  try {
    res.set('content-type', 'application/json').send(await ridesService.get(id))
  } catch (error) {
    res.send(error)
    logger.log({
      level: 'error',
      message: `Error while getting the ride`,
    })
  }
}

module.exports = { create, fetch, get }

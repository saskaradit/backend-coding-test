class Ride {
  constructor(
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    riderName,
    driverName,
    driverVehicle
  ) {
    this.startLatitude = startLatitude
    this.startLongitude = startLongitude
    this.endLatitude = endLatitude
    this.endLongitude = endLongitude
    this.riderName = riderName
    this.driverName = driverName
    this.driverVehicle = driverVehicle
  }
}

module.exports = Ride

class Ride {
  startLatitude: number
  startLongitude: number
  endLatitude: number
  endLongitude: number
  riderName: string
  driverName: string
  driverVehicle: string
  constructor(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    riderName: string,
    driverName: string,
    driverVehicle: string
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

export default Ride

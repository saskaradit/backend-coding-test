# Xendit Coding Exercise

**This is a Ride API created using Node Express Framework.**
The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit. Please follow the instructions below to complete the assessment.


``` important: tests may sometimes fail, please re-run the test as the Database is in memory ```

- [Xendit Coding Exercise](#xendit-coding-exercise)
    - [Documentation](#documentation)
      - [API-Docs](#api-docs)
      - [Healthcheck](#healthcheck)
      - [Rides](#rides)

### Documentation

Please deliver documentation of the server that clearly explains the goals of this project and clarifies the API response that is expected.

#### API-Docs 
API documentation using swagger
```http
GET /api-docs
```


#### Healthcheck
Check if the instance (server) is up and running.
```http
GET /health
```
**Responses**
```javascript
Healthy
```

#### Rides
  
Get rider documents on a specific page
````http
GET /rides?pages=5
````
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | `number` |  page number, defaults to 1 |


Get a specific rider document
````http
GET /rides/:id
````
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `number` | **Required**. RideId |


Creates a rider document
````http
POST /rides
````
**Requests Body**

When creating a ride, client needs to fill these request body in the following format:
```javascript
{
    "start_lat": Number,
    "start_long": Number,
    "end_lat": Number,
    "end_long": Number,
    "rider_name": String,
    "driver_name": String,
    "driver_vehicle": String
}
```

**Responses**

Rides API returns the response in the following format:
```javascript
[
    {
        "rideID": Number,
        "startLat": Number,
        "startLong": Number,
        "endLat": Number,
        "endLong": Number,
        "riderName": String,
        "driverName": String,
        "driverVehicle": String,
        "created": Date
    }
]
```

**Error Messages**

Rides API returns the error response in the following format:
```javascript
{
    "error_code": "ERROR_CODE",
    "message": "error message"
}
```



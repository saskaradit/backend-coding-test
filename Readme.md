# Xendit Coding Exercise

The goal of these exercises are to assess your proficiency in software engineering that is related to the daily work that we do at Xendit. Please follow the instructions below to complete the assessment.

## Setup

1. Create a new repository in your own github profile named `backend-coding-test` and commit the contents of this folder
2. Ensure `node (>8.6 and <= 10)` and `npm` are installed
3. Run `npm install`
4. Run `npm test`
5. Run `npm start`
6. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Tasks

Below will be your set of tasks to accomplish. Please work on each of these tasks in order. Success criteria will be defined clearly for each task

- [Xendit Coding Exercise](#xendit-coding-exercise)
  - [Setup](#setup)
  - [Tasks](#tasks)
    - [Documentation](#documentation)
      - [Healthcheck](#healthcheck)
      - [Rides](#rides)
      - [Success Criteria](#success-criteria)
    - [Implement Tooling](#implement-tooling)
      - [Success Criteria](#success-criteria-1)
    - [Security](#security)
      - [Success Criteria](#success-criteria-2)
    - [Load Testing](#load-testing)
      - [Success Criteria](#success-criteria-3)

### Documentation

Please deliver documentation of the server that clearly explains the goals of this project and clarifies the API response that is expected.

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


#### Success Criteria
1. **[BONUS]** Create an easy way to deploy and view the documentation in a web format and include instructions to do so

### Implement Tooling

Please implement the following tooling:

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging

#### Success Criteria
1. **[BONUS]** Add integration to CI such as Travis or Circle
2. **[BONUS]** Add Typescript support


3. **[BONUS]** Split between functional and imperative function and test independently


### Security

Please implement the following security controls for your system:

1. Ensure the system is not vulnerable to [SQL injection](https://www.owasp.org/index.php/SQL_Injection)
2. **[BONUS]** Implement an additional security improvement of your choice

#### Success Criteria

1. A pull request against `master` of your fork with:
    1. Changes to the code
    2. Tests ensuring the vulnerability is addressed

### Load Testing

Please implement load testing to ensure your service can handle a high amount of traffic

#### Success Criteria

1. Implement load testing using `artillery`
    1. Create a PR against `master` of your fork including artillery
    2. Ensure that load testing is able to be run using `npm test:load`. You can consider using a tool like `forever` to spin up a daemon and kill it after the load test has completed.
    3. Test all endpoints under at least `100 rps` for `30s` and ensure that `p99` is under `50ms`

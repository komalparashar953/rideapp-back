# /users/register Endpoint Documentation

## Description
The `/users/register` endpoint is used to register a new user. It receives user details, hashes the password, stores the user in the database, and returns an authentication token.

## HTTP Method
`POST /users/register`

## Request Body
The endpoint expects a JSON payload with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

## Example Response
```json
{
  "token": "generated-authentication-token",
  "user": {
    "_id": "userId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

## Status Codes
- **201 Created**: User registered successfully.
- **400 Bad Request**: Validation failed or missing fields.

---

# /users/login Endpoint Documentation

## Description
The `/users/login` endpoint allows an existing user to log in. It checks the provided credentials and returns an authentication token if successful.

## HTTP Method
`POST /users/login`

## Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

## Example Response
```json
{
  "token": "generated-authentication-token",
  "user": {
    "_id": "userId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

## Status Codes
- **200 OK**: Login successful.
- **400 Bad Request**: Validation failed or missing fields.
- **401 Unauthorized**: Invalid email or password.

---

# /users/profile Endpoint Documentation

## Description
The `/users/profile` endpoint returns the authenticated user's profile information. The request must include a valid authentication token (JWT) in the cookie or `Authorization` header.

## HTTP Method
`GET /users/profile`

## Headers
- `Authorization: Bearer <token>` (if not using cookies)

## Example Response
```json
{
  "_id": "userId",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

## Status Codes
- **200 OK**: Profile fetched successfully.
- **401 Unauthorized**: Missing or invalid authentication token.

---

# /users/logout Endpoint Documentation

## Description
The `/users/logout` endpoint logs out the authenticated user by blacklisting the current token and clearing the authentication cookie.

## HTTP Method
`GET /users/logout`

## Headers
- `Authorization: Bearer <token>` (if not using cookies)

## Example Response
```json
{
  "message": "Logged out successfully"
}
```

## Status Codes
- **200 OK**: Logout successful.
- **401 Unauthorized**: Missing or invalid authentication token.

---

# /captains/register Endpoint Documentation

## Description
The `/captains/register` endpoint is used to register a new captain (driver). It receives captain details, including vehicle information, hashes the password, stores the captain in the database, and returns an authentication token.

## HTTP Method
`POST /captains/register`

## Request Body
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

- **fullname.firstname** (string): Required. At least 3 characters.
- **fullname.lastname** (string): Required. At least 3 characters.
- **email** (string): Required. Must be a valid email and at least 5 characters.
- **password** (string): Required. At least 6 characters.
- **vehicle.color** (string): Required. At least 3 characters.
- **vehicle.plate** (string): Required. At least 3 characters.
- **vehicle.capacity** (number): Required. Must be a number, at least 1.
- **vehicle.vehicleType** (string): Required. Must be one of: `car`, `bike`, `auto`.

## Example Response
```json
{
  "token": "generated-authentication-token",
  "captain": {
    "_id": "captainId",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

## Status Codes
- **201 Created**: Captain registered successfully.
- **400 Bad Request**: Validation failed or missing fields.
- **422 Unprocessable Entity**: Validation errors in request body.

---

# /captains/login Endpoint Documentation

## Description
The `/captains/login` endpoint allows an existing captain to log in. It checks the provided credentials and returns an authentication token if successful.

## HTTP Method
`POST /captains/login`

## Request Body
```json
{
  "email": "jane.smith@example.com",
  "password": "yourpassword"
}
```

## Example Response
```json
{
  "token": "generated-authentication-token",
  "captain": {
    "_id": "captainId",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

## Status Codes
- **200 OK**: Login successful.
- **400 Bad Request**: Validation failed or missing fields, or invalid credentials.

---

# /captains/profile Endpoint Documentation

## Description
The `/captains/profile` endpoint returns the authenticated captain's profile information. The request must include a valid authentication token (JWT) in the cookie or `Authorization` header.

## HTTP Method
`GET /captains/profile`

## Headers
- `Authorization: Bearer <token>` (if not using cookies)

## Example Response
```json
{
  "captain": {
    "_id": "captainId",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

## Status Codes
- **200 OK**: Profile fetched successfully.
- **401 Unauthorized**: Missing or invalid authentication token.

---

# /captains/logout Endpoint Documentation

## Description
The `/captains/logout` endpoint logs out the authenticated captain by blacklisting the current token and clearing the authentication cookie.

## HTTP Method
`GET /captains/logout`

## Headers
- `Authorization: Bearer <token>` (if not using cookies)

## Example Response
```json
{
  "message": "Logged out successfully"
}
```

## Status Codes
- **200 OK**: Logout successful.
- **401 Unauthorized**: Missing or invalid authentication token.

---

# /maps/get-coordinates Endpoint Documentation

## Description
The `/maps/get-coordinates` endpoint returns the latitude and longitude coordinates for a given address. The user must be authenticated to access this endpoint.

## HTTP Method
`GET /maps/get-coordinates`

## Query Parameters

- **address** (string): Required. The address to geocode. Must be at least 3 characters.

### Example Request

```
GET /maps/get-coordinates?address=citymall%20noida
Authorization: Bearer <token>
```

## Example Response

```json
{
  "lat": 28.5678,
  "lng": 77.3456
}
```

## Status Codes

- **200 OK**: Coordinates fetched successfully.
- **400 Bad Request**: Validation failed or missing/invalid parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **404 Not Found**: Coordinates not found.

---

# /maps/get-distance-time Endpoint Documentation

## Description
The `/maps/get-distance-time` endpoint returns the distance and estimated travel time between two addresses. The user must be authenticated to access this endpoint.

## HTTP Method
`GET /maps/get-distance-time`

## Query Parameters

- **origin** (string): Required. The starting address. Must be at least 3 characters.
- **destination** (string): Required. The destination address. Must be at least 3 characters.

### Example Request

```
GET /maps/get-distance-time?origin=38A%2C%20chopra%20cafe&destination=citymall%20noida
Authorization: Bearer <token>
```

## Example Response

```json
{
  "distance": { "text": "5.2 km", "value": 5200 },
  "duration": { "text": "12 mins", "value": 720 }
}
```

## Status Codes

- **200 OK**: Distance and time fetched successfully.
- **400 Bad Request**: Validation failed or missing/invalid parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **404 Not Found**: No routes found.
- **500 Internal Server Error**: Error occurred while fetching data.

---

# /maps/get-suggestions Endpoint Documentation

## Description
The `/maps/get-suggestions` endpoint returns autocomplete suggestions for a given input string, useful for address or location search. The user must be authenticated to access this endpoint.

## HTTP Method
`GET /maps/get-suggestions`

## Query Parameters

- **input** (string): Required. The partial address or search string. Must be at least 3 characters.

### Example Request

```
GET /maps/get-suggestions?input=citymall
Authorization: Bearer <token>
```

## Example Response

```json
[
  { "description": "Citymall Noida", "place_id": "xyz123" },
  { "description": "Citymall Bhopal", "place_id": "abc456" }
]
```

## Status Codes

- **200 OK**: Suggestions fetched successfully.
- **400 Bad Request**: Validation failed or missing/invalid parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **500 Internal Server Error**: Error occurred while fetching suggestions.

---

# /rides/create Endpoint Documentation

## Description
The `/rides/create` endpoint creates a new ride request for the authenticated user. It calculates the fare and generates an OTP for the ride.

## HTTP Method
`POST /rides/create`

## Request Body

```json
{
  "pickup": "38A, chopra cafe",
  "destination": "citymall noida",
  "vehicleType": "car"
}
```

- **pickup** (string): Required. The pickup location. Must be at least 4 characters.
- **destination** (string): Required. The destination location. Must be at least 4 characters.
- **vehicleType** (string): Required. Must be one of: `auto`, `car`, `bike`.

## Headers

- `Authorization: Bearer <token>`

## Example Response

```json
{
  "_id": "rideId",
  "user": "userId",
  "pickup": "38A, chopra cafe",
  "destination": "citymall noida",
  "fare": 210.2,
  "status": "pending",
  "otp": "123456"
}
```

## Status Codes

- **201 Created**: Ride created successfully.
- **400 Bad Request**: Validation failed or missing/invalid parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **500 Internal Server Error**: Error occurred while creating ride.

---

# /rides/get-fare Endpoint Documentation

## Description
The `/rides/get-fare` endpoint calculates and returns the estimated fare for a ride based on the provided pickup and destination addresses. The user must be authenticated to access this endpoint.

## HTTP Method
`GET /rides/get-fare`

## Query Parameters

- **pickup** (string): Required. The pickup address. Must be at least 4 characters.
- **destination** (string): Required. The destination address. Must be at least 4 characters.

### Example Request

```
GET /rides/get-fare?pickup=38A%2C%20chopra%20cafe&destination=citymall%20noida
Authorization: Bearer <token>
```

## Example Response

```json
{
  "auto": 193.2,
  "car": 210.2,
  "bike": 150.2
}
```

- Each key represents a vehicle type and the value is the estimated fare for that type.

## Status Codes

- **200 OK**: Fare calculated successfully.
- **400 Bad Request**: Validation failed or missing/invalid parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **500 Internal Server Error**: Error occurred while calculating fare.

---


# Florify API

## Endpoint

https://testing-flo.et.r.appspot.com

## Register User API

URL : /register

Mehod : POST

Request Body :

```json
{
  "name": "darfa",
  "email": "darfa@gmail.com",
  "password": "1234567Aa"
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "User registered successfully",
  "userId": "user-c43fb8fb-ce25-49ab-94cf-b716aa1d5dcd"
}
```

Response Body Error :

```json
{
  "error": true,
  "message": "Email and password are required"
}
```

```json
{
  "error": true,
  "message": "Password must be at least 8 characters long"
}
```

```json
{
  "error": true,
  "message": "Email already registered"
}
```

```json
{
  "error": true,
  "message": "Failed to register user"
}
```

## Login User API

URL : /login

Mehod : POST

Request Body :

```json
{
  "email": "darfa@gmail.com",
  "password": "1234567Aa"
}
```

Response Body Success :

```json
{
  "error": false,
  "message": "User logged in successfully",
  "loginResult": {
    "userId": "user-9690644f-610c-4d52-a520-1f5eb9c1c9d9",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTk2OTA2NDRmLTYxMGMtNGQ1Mi1hNTIwLTFmNWViOWMxYzlkOSIsImlhdCI6MTcxNzkxMDMxMn0.f7y7LlQjLcPze_N9mvk06RZUKnwBHU1kcvECMBrRlms"
  }
}
```

Response Body Error :

```json
{
  "error": true,
  "message": "Email and password are required"
}
```

```json
{
  "error": true,
  "message": "Invalid email or password"
}
```

```json
{
  "error": true,
  "message": "Invalid email or password"
}
```

```json
{
  "error": true,
  "message": "Failed to log in user"
}
```

## Get User API

URL :

Mehod : GET

Headers :

- Authorization : token

Response Body Success:

```json
{
  "error": false,
  "message": "",
  "data": {
    "name": "darfa",
    "email": "darfa@gmail.com"
  }
}
```

Response Body Error :

```json
{
  "error": true,
  "message": "Unauthorized"
}
```

## Logout User API

URL : /logout

Mehod :

Headers :

- Authorization : token

Response Body Success :

```json
{
  "error": false,
  "message": "User logged out successfully"
}
```

Response Body Error :

```json
{
  "error": true,
  "message": "Failed to log out user"
}
```

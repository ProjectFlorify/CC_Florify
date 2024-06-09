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
  "message": "User registered successfully",
  "userId": "user-1ed365f7-5589-4727-8bad-c005c4740ed3"
}
```

Response Body Error :

```json
{
  "errors": "Email and password are required"
}
```

```json
{
  "errors": "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number"
}
```

```json
{
  "errors": "Email already registered"
}
```

```json
{
  "errors": "Email and password are required"
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
  "error": "false",
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
  "error": "True",
  "message": "Email and password are required"
}
```

```json
{
  "error": "True",
  "message": "Invalid email or password"
}
```

```json
{
  "error": "True",
  "message": "Invalid email or password"
}
```

```json
{
  "error": "True",
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
  "error": "false",
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
  "error": "True",
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
  "error": "false",
  "message": "User logged out successfully"
}
```

Response Body Error :

```json
{
  "error": "True",
  "message": "Failed to log out user"
}
```

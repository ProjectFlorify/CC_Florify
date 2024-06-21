# Florify API

## Register User API

URL : `/register`

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

## Login User API

URL : `/login`

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

## Get User API

URL :`/user`

Mehod : GET

Headers :

- `Authorization` : `Bearer <token>`

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

## Update User API

URL :`/update`

Mehod : PATCH

Headers :

- `Authorization` : `Bearer <token>`

Request Body :

```json
{
  "name": "test",
  "email": "test123@gmail.com",
  "password": "12345678b"
}
```

Response Body Success:

```json
{
  "error": false,
  "message": "User updated successfully"
}
```

## Logout User API

URL : `/logout`

Method : POST

Headers :

- `Authorization` : `Bearer <token>`

Response Body Success :

```json
{
  "error": false,
  "message": "User logged out successfully"
}
```

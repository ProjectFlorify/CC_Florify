# Florify API

These are all the APIs that will be used in the Florify app project. The API is made to run these functions :

- Handle register, login, get, udpate and logout for user
- Handle the plant prediction, history and delete for user
- Handle the encyclopedia and search for user
- Handle the forum, comment, and search forum for user

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

- `Authorization` : `token`

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

- `Authorization` : `token`

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

- `Authorization` : `token`

Response Body Success :

```json
{
  "error": false,
  "message": "User logged out successfully"
}
```

## Get Encyclopedia API

URL : `/encyclopedia`

Mehod : GET

Response Body Success :

```json
{
  "error": false,
  "encyclopedia": [
      {
          "id": "3bfwpU7xjIWZGw2YBDWt",
          "description": "Common rust in maize is caused by the fungus Puccinia sorghi. The disease usually appears every growing season, but rarely occurs in hybrid maize. The initial symptoms are chlorotic spots on the leaf surface that develop into brick-red pustules as the spores penetrate the leaf surface. These pustules are oval or elongated, about 1/8 inch long, and sparsely scattered or clustered. Leaf tissue around the pustules may turn yellow or die, leaving a lesion of dead tissue. Lesions sometimes form a band across the leaf and the entire leaf will die if severely infected. As the pustules age, the red spores turn black, so the pustules appear black and continue to erupt through the leaf surface. Husks, midribs and petioles may also become infected.",
          "handling": "To manage corn common rust, use resistant corn varieties. Timely application of fungicides is crucial, especially when early symptoms appear, to control the disease spread. Crop rotation can help reduce the inoculum in the field, avoiding planting corn consecutively in the same area.",
          "title": "Corn Common Rust",
          "image": "https://storage.googleapis.com/florify-bucket/assets/Corn%20Common%20Rust.jpg"
      },
      {
          "id": "BkbP8SLC7j23rzYNUTDB",
          "image": "https://storage.googleapis.com/florify-bucket/assets/Rice%20Leaf%20Blast.jpg",
          "description": "Leaf blast on rice is caused by the fungus Magnaporthe oryzae. Early symptoms include small gray spots on leaves that develop into diamond-shaped lesions with brown or reddish-brown edges. Severe infections can cause leaves to dry out and die, reducing yield.",
          "handling": "Managing leaf blast involves using resistant varieties and timely fungicide application. Agricultural practices such as crop rotation, good irrigation management, and balanced fertilizer use can help reduce infection risk.",
          "title": "Rice Leaf Blast"
      }
  ]
}
```

## Encyclopedia Search API

URL : `/encyclopedia/search`

Mehod : GET

Response Body Success :

```json
{
  "error": false,
  "encyclopedia": [
      {
          "id": "GOkEIyL1HnRSMLcWyqXI",
          "image": "https://storage.googleapis.com/florify-bucket/assets/Rice%20Neck%20Blast.jpg",
          "description": "Neck blast on rice is also caused by the fungus Magnaporthe oryzae. Early symptoms include brown or black lesions at the base of the panicle or neck of the rice plant. Severe infections can cause the panicle to become sterile and significantly reduce yield. In severe cases, infected panicles may break and fall off.",
          "handling": "To control neck blast, use resistant varieties and apply fungicides regularly, especially during humid conditions. Agricultural practices such as crop rotation, good irrigation management, and balanced fertilizer use are crucial to reducing infection risk.",
          "title": "Rice Neck Blast"
      }
  ]
}
```

## Plant Prediction API

URL : `/predict`

Mehod : POST

Headers :

- `Content-Type` : `multipart/form-data`
- `Authorization` : `token`

Request Body :

- `plant type` as `string`
- `image` as `file`

Response Body Success :

```json
{
  "predicted_class": "Rice Neck Blast",
  "probabilities": [
      0.1530480533838272,
      0.15402638912200928,
      0.15303055942058563,
      0.1718008667230606,
      0.3680940866470337
  ]
}
```

## Plant Prediction History API

URL : `/predict/user`

Mehod : GET

Headers :

- `Authorization` : `token`

Response Body Success :

```json
{
   "error": false,
    "predictions": [
        {
            "plant": "rice",
            "imageUrl": "https://storage.googleapis.com/florify-bucket/upload/user-151f6f24-1f32-475e-8435-05dda18e52ab/1718705196218_blast18.JPG",
            "prediction": "Rice Neck Blast",
            "id": "predict-cb3c547e-1256-4590-afad-63ec0ce6b9ee",
            "timestamp": {
                "_seconds": 1718705235,
                "_nanoseconds": 494000000
            }
        }
    ]
}
```

## Plant Prediction Delete API

URL : `/predict/delete/:predictionId`

Mehod : DELETE

Headers :

- `Authorization` : `token`

Response Body Success :

```json
{
  "error": false,
  "message": "Prediction and image deleted successfully."
}
```

## Plant Prediction Delete All API

URL : `/predict/deleteAll`

Mehod : DELETE

Headers :

- `Authorization` : `token`

Response Body Success :

```json
{
  "error": false,
  "message": "All predictions and images deleted successfully.."
}
```

## Forum API

URL : `/forum/:predictionId`

Method : POST

Headers : 

- `Authorization` : `token`

Request Body :

```json
{
  "caption": "rice prediction"
}
```

Response Body Success :

```json
{
  "error": false,
  "postData": {
        "id": "forum-85ccb733-c412-4eb0-b02d-23db0ab21f0d",
        "userName": "darfa",
        "imagePrediction": "https://storage.googleapis.com/florify-bucket/forum/user-1ce45dc3-c256-4f0b-b00d-b00999d8d82d/1718877119732_blast18.JPG",
        "plantPrediction": "rice",
        "resultPrediction": "Rice Neck Blast",
        "caption": "rice prediction",
        "timestamp": "2024-06-20T09:53:55.161Z"
    }
}
```

## Get Forum Data

URL : `/forum`

Method : GET

Response Body Success :

```json
{
  {
    "error": false,
    "forumData": [
        {
            "imagePrediction": "https://storage.googleapis.com/florify-bucket/forum/user-1ce45dc3-c256-4f0b-b00d-b00999d8d82d/1718798734433_Corn Healthy.jpg",
            "resultPrediction": "Corn Healthy",
            "plantPrediction": "corn",
            "caption": "this app is so accurate",
            "id": "forum-2ca740b1-2ebc-4e29-8598-f21eb4f1ef6b",
            "userName": "darfa",
            "timestamp": {
                "_seconds": 1718804883,
                "_nanoseconds": 616000000
            }
        }
    ]
  }
}
```

## Post Forum Comment API

URL : `/forum/:forumId/comment`

Method : POST

Headers :

- `Authorization` : `token`

Request Body :

```json
{
  "comment": "Wah benar sekali"
}
```

Response Body Success :

```json
{
  "error": false,
  "commentData": {
      "id": "comment-f5929268-208f-4c63-b861-74c4d87dc11c",
      "userName": "darfa",
      "comment": "wah benar sekali",
      "timestamp": "2024-06-20T10:06:27.143Z"
  }
}
```

## Get Forum by ID API

URL : `/forum/:forumId`

Method : GET

Response Body Success :

```json
{
  "error": false,
  "forumData": {
      "imagePrediction": "https://storage.googleapis.com/florify-bucket/forum/user-1ce45dc3-c256-4f0b-b00d-b00999d8d82d/1718877119732_blast18.JPG",
      "resultPrediction": "Rice Neck Blast",
      "plantPrediction": "rice",
      "caption": "rice prediction",
      "id": "forum-85ccb733-c412-4eb0-b02d-23db0ab21f0d",
      "userName": "darfa",
      "timestamp": {
          "_seconds": 1718877235,
          "_nanoseconds": 161000000
      },
      "comments": [
          {
              "comment": "wah benar sekali",
              "id": "comment-f5929268-208f-4c63-b861-74c4d87dc11c",
              "userName": "darfa",
              "timestamp": {
                  "_seconds": 1718877987,
                  "_nanoseconds": 143000000
              }
          }
      ]
  }
}
```

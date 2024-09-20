### ML model

Machine Learning Model endpoint (for using the ML model): https://ml-1069614541613.asia-southeast2.run.app

URL : `/predict`

Mehod : POST

Request Body :

- `image` as `file`
- `plant` as `text`

Response Body Success :

```json
{
    "predicted_class": "Corn Gray Leaf Spot",
    "probabilities": [
        0.17850738763809204,
        0.4508848488330841,
        0.17851440608501434,
        0.1920933574438095
    ]
}
```

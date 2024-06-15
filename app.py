from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model
from PIL import Image
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATHS = {
    'potato': 'potato_disease_model.h5',
    'rice': 'rice_disease_model.h5',
    'corn': 'corn_disease_model.h5'
}

CLASS_NAMES = {
    'potato': ['Potato Early Blight', 'Potato Healthy', 'Potato Late Blight'],
    'rice': ['Rice Brown Spot', 'Rice Healthy',  'Rice Hispa', 'Rice Leaf Blast', 'Rice Neck Blast'],
    'corn': ['Corn Common Rust', 'Corn Gray Leaf Spot', 'Corn Healthy', 'Corn Northern Leaf Blight']
}

models = {}
for plant, path in MODEL_PATHS.items():
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file for {plant} not found at {path}")
    models[plant] = load_model(path, compile=False)

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

@app.route('/', methods=['GET'])
def index():
    return 'Welcome to Florify Model Server!'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files or 'plant' not in request.form:
            return jsonify({"error": "No image file or plant type provided"}), 400

        plant = request.form['plant']
        if plant not in models:
            return jsonify({"error": "Invalid plant type provided"}), 400

        file = request.files['image']
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)

        model = models[plant]
        predictions = model.predict(processed_image)
        probabilities = tf.nn.softmax(predictions[0])
        predicted_class_index = np.argmax(probabilities)
        predicted_class_label = CLASS_NAMES[plant][predicted_class_index]

        return jsonify({
            "predicted_class": predicted_class_label,
            "probabilities": probabilities.numpy().tolist()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    print(f"Your model server is running on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port)

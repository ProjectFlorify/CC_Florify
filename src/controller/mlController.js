const axios = require("axios");
const FormData = require("form-data");
const db = require("../services/firestore");
const crypto = require("crypto");
const { uploadImageToGCS, deleteImageFromGCS } = require("./GCS");

const postPrediction = async (req, res) => {
  const { plant } = req.body;
  const imageFile = req.file;

  if (!plant || !imageFile) {
    return res.status(401).json({ error: true, message: "Plant type and image file are required." });
  }

  try {
    const userId = req.user.userId;

    const imageUrl = await uploadImageToGCS(userId, imageFile);

    const formData = new FormData();
    formData.append("plant", plant);
    formData.append("image", imageFile.buffer, imageFile.originalname);

    const response = await axios.post(process.env.MODEL_URL, formData, {
      headers: formData.getHeaders(),
    });

    const id = crypto.randomUUID();
    const predictionId = `predict-${id}`;

    const predictionData = {
      id: predictionId,
      plant: plant,
      prediction: response.data.predicted_class,
      imageUrl: imageUrl,
      timestamp: new Date(),
    };

    await db.collection("users").doc(userId).collection("predictions").doc(predictionId).set(predictionData);

    res.status(200).json({ error: false, predictionData });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const getPredictionsHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    const snapshot = await db.collection("users").doc(userId).collection("predictions").get();
    const predictions = snapshot.docs.map((doc) => doc.data());

    return res.status(200).json({ error: false, predictions });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const deletePrediction = async (req, res) => {
  const userId = req.user.userId;
  const { predictionId } = req.params;

  try {
    const predictionRef = db.collection("users").doc(userId).collection("predictions").doc(predictionId);
    const doc = await predictionRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: true, message: "Prediction not found." });
    }

    const predictionData = doc.data();
    await predictionRef.delete();

    await deleteImageFromGCS(predictionData.imageUrl);

    return res.status(200).json({ error: false, message: "Prediction and image deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const deleteAllPredictions = async (req, res) => {
  const userId = req.user.userId;

  try {
    const predictionsSnapshot = await db.collection("users").doc(userId).collection("predictions").get();
    const batch = db.batch();
    const imageUrls = [];

    predictionsSnapshot.forEach(doc => {
      const predictionData = doc.data();
      const predictionRef = db.collection("users").doc(userId).collection("predictions").doc(doc.id);

      batch.delete(predictionRef);
      imageUrls.push(predictionData.imageUrl);
    });

    await batch.commit();

    await Promise.all(imageUrls.map(url => deleteImageFromGCS(url)));

    return res.status(200).json({ error: false, message: "All predictions and images deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { postPrediction, getPredictionsHistory, deletePrediction, deleteAllPredictions  };

const axios = require("axios");
const FormData = require("form-data");
const db = require("../services/firestore");
const uploadImageToGCS = require("../services/uploadToGCS");

const postPrediction = async (req, res) => {
  const { plant } = req.body;
  const imageFile = req.file;

  if (!plant || !imageFile) {
    return res.status(400).json({ error: true, message: "Plant type and image file are required." });
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

    const predictionData = {
      plant: plant,
      prediction: response.data.predicted_class,
      imageUrl: imageUrl,
      timestamp: new Date(),
    };

    await db.collection("users").doc(userId).collection("predictions").add(predictionData);

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
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { postPrediction, getPredictionsHistory };

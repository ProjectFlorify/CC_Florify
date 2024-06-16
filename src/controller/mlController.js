const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const fs = require("fs");
const db = require("../firestore");

const upload = multer({ dest: "uploads/" });

const handleFileUpload = upload.single("image");

const postPrediction = (req, res) => {
  handleFileUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: true, message: "Error uploading file." });
    }

    const userId = req.user.userId;

    const { plant } = req.body;
    const imageFile = req.file;

    if (!plant || !imageFile) {
      return res.status(400).json({ error: true, message: "Plant type and image file are required." });
    }

    try {
      const formData = new FormData();
      formData.append("plant", plant);
      formData.append("image", fs.createReadStream(imageFile.path));

      const response = await axios.post("https://ml-vpbrsb64qq-et.a.run.app/predict", formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      fs.unlinkSync(imageFile.path);

      const predictionData = {
        user: userId,
        plant: plant,
        prediction: response.data.predicted_class,
        timestamp: new Date(),
      };

      await db.collection("predictions").add(predictionData);

      return res.status(200).json({ error: false, predictionData });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};

const getPredictionsHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    const snapshot = await db.collection("predictions").where("user", "==", userId).get();
    const predictions = snapshot.docs.map((doc) => doc.data());

    return res.status(200).json({ error: false, predictions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { postPrediction, getPredictionsHistory };

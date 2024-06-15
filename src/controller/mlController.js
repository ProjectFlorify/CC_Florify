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
      return res.status(400).send("Error uploading file.");
    }

    const userId = req.user.userId;

    const { plant } = req.body;
    const imageFile = req.file;

    if (!plant || !imageFile) {
      return res.status(400).send("Plant type and image file are required.");
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

      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request.");
    }
  });
};

module.exports = { postPrediction };

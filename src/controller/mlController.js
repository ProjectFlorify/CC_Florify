const { Firestore } = require("@google-cloud/firestore");
const crypto = require("crypto");
const predictClassification = require("../services/prediction");

const db = new Firestore();
const predictCollection = db.collection("predictions");

async function postPrediction(req, res) {
  try {
    const { image } = req.files;
    const { model } = req.app.locals;

    if (!image) return res.status(400).json({ status: "fail", message: "No image file provided" });

    const { label, explanation, suggestion } = await predictClassification(model, image.data);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      explanation: explanation,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await predictCollection.doc(id).set(data);

    return res.status(201).json({ status: "success", message: "Model prediction successful", data: data });
  } catch (error) {
    if (req.file && req.file.truncated) return res.status(413).json({ status: "fail", message: "Payload content length greater than maximum allowed: 1000000" });

    return res.status(500).json({ status: "fail", message: error.message });
  }
}

module.exports = postPrediction;

const db = require("../services/firestore");

const getEncyclopedia = async (req, res) => {
  try {
    const collectionSnapshot = await db.collection("encyclopedia").get();

    if (collectionSnapshot.empty) {
      return res.status(404).json({ error: true, message: "No documents found" });
    }

    const encyclopedia = [];
    collectionSnapshot.forEach((doc) => {
      encyclopedia.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json({ error: false, encyclopedia });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEncyclopediaByTitle = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: true, message: "Query parameter is missing" });
    }

    const documentSnapshot = await db.collection("encyclopedia").where("title", "==", q).get();

    if (documentSnapshot.empty) {
      return res.status(404).json({ error: true, message: "Document not found" });
    }

    const encyclopedia = [];
    documentSnapshot.forEach((doc) => {
      encyclopedia.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json({ error: false, encyclopedia });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getEncyclopedia, getEncyclopediaByTitle };

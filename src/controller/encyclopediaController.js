const db = require("../firestore");

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

const getEncyclopediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const documentSnapshot = await db.collection("encyclopedia").doc(id).get();

    if (!documentSnapshot.exists) {
      return res.status(404).json({ error: true, message: "Document not found" });
    }

    const encyclopedia = { id: documentSnapshot.id, ...documentSnapshot.data() };

    return res.status(200).json({ error: false, encyclopedia });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getEncyclopedia, getEncyclopediaById };

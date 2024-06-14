const db = require('../firestore'); 

const getEncyclopedia = async (req, res) => {
  try {
    const snapshot = await db.collection("encyclopedia").get();

    if (snapshot.empty) {
      return res.status(404).json({ error: true, message: "No documents found" });
    }

    const encyclopedia = [];
    snapshot.forEach((doc) => {
      encyclopedia.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json({ error: false, encyclopedia });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getEncyclopedia;

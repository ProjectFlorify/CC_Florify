const db = require("../services/firestore");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { deleteImageFromGCS } = require("./GCS");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: true, message: "Email and password are required" });

  if (password.length < 8) return res.status(400).json({ error: true, message: "Password must be at least 8 characters long" });

  const checkUsedEmail = await db.collection("users").where("email", "==", email).get();
  if (!checkUsedEmail.empty) return res.status(400).json({ error: true, message: "Email already registered" });

  try {
    const id = crypto.randomUUID();
    const userId = `user-${id}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const dataUser = {
      name,
      email,
      password: hashedPassword,
    };
    await db.collection("users").doc(userId).set(dataUser);

    return res.status(200).json({ error: false, message: "User registered successfully", userId });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: true, message: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: true, message: "Email and password are required" });

  try {
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (userSnapshot.empty) return res.status(400).json({ error: true, message: "Invalid email or password" });
    const user = userSnapshot.docs[0].data();

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ error: true, message: "Invalid email or password" });
    const accessToken = jwt.sign({ userId: userSnapshot.docs[0].id }, process.env.SECRET_KEY, { expiresIn: "24h" });

    return res.status(200).json({ error: false, message: "User logged in successfully", token: accessToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: true, message: "Failed to log in user" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userSnapshot = await db.collection("users").doc(userId).get();
    if (!userSnapshot.exists) return res.status(404).json({ error: true, message: "User not found" });

    const userData = userSnapshot.data();
    return res.status(200).json({ error: false, message: "User data retrieved successfully", userData });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json({ error: true, message: "Failed to retrieve user data" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.userId;

  if (!name && !email && !password) return res.status(400).json({ error: true, message: "No data to update" });

  try {
    const userSnapshot = await db.collection("users").doc(userId).get();
    if (!userSnapshot.exists) return res.status(404).json({ error: true, message: "User not found" });

    let updatedData = {};

    if (name) updatedData.name = name;
    if (email) {
      const checkUsedEmail = await db.collection("users").where("email", "==", email).get();
      if (!checkUsedEmail.empty) return res.status(400).json({ error: true, message: "Email already registered" });
      updatedData.email = email;
    }

    if (password) {
      if (password.length < 8) return res.status(400).json({ error: true, message: "Password must be at least 8 characters long" });
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    await db.collection("users").doc(userId).update(updatedData);

    return res.status(200).json({ error: false, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: true, message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userSnapshot = await db.collection("users").doc(userId).get();
    if (!userSnapshot.exists) return res.status(404).json({ error: true, message: "User not found" });

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

    await db.collection("users").doc(userId).delete();

    return res.status(200).json({ error: false, message: "User and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: true, message: "Failed to delete user" });
  }
};

const logoutUser = async (req, res) => {
  return res.status(200).json({ error: false, message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser, logoutUser };

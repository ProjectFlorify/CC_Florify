require("dotenv").config();
const express = require("express");
const router = express.Router();
const Firestore = require("@google-cloud/firestore");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const db = new Firestore();
  const usersCollection = db.collection("users");

  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Email and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: true, message: "Password must be at least 8 characters long" });
  }

  const checkUsedEmail = await usersCollection.where("email", "==", email).get();
  if (!checkUsedEmail.empty) {
    return res.status(400).json({ error: true, message: "Email already registered" });
  }

  try {
    const id = crypto.randomUUID();
    const userId = `user-${id}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const dataUser = {
      name,
      email,
      password: hashedPassword,
    };
    await usersCollection.doc(userId).set(dataUser);
    return res.status(200).json({ error: false, message: "User registered successfully", userId });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: true, message: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  const db = new Firestore();
  const usersCollection = db.collection("users");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Email and password are required" });
  }

  try {
    const userSnapshot = await usersCollection.where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ error: true, message: "Invalid email or password" });
    }

    const user = userSnapshot.docs[0].data();
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: true, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ userId: userSnapshot.docs[0].id }, process.env.SECRET_KEY);
    return res.status(200).json({ error: false, message: "User logged in successfully", loginResult: { userId: userSnapshot.docs[0].id, accessToken } });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: true, message: "Failed to log in user" });
  }
});

module.exports = router;

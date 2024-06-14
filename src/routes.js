require("dotenv").config();
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser } = require("./controller/userController");
const { verifyToken } = require("./middleware/userMiddleware");
const postPrediction = require("./controller/mlController");
const { getEncyclopedia, getEncyclopediaById } = require("./controller/encyclopediaController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/user", verifyToken, getUser);

router.post("/logout", logoutUser);

router.get("/encyclopedia", getEncyclopedia);

router.get("/encyclopedia/:id", getEncyclopediaById);

// router.post("/predict", postPrediction);

module.exports = router;

require("dotenv").config();
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, logoutUser } = require("./controller/userController");
const { verifyToken } = require("./middleware/userMiddleware");
const { postPrediction, getPredictionsHistory } = require("./controller/mlController");
const { getEncyclopedia, getEncyclopediaByTitle } = require("./controller/encyclopediaController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/user", verifyToken, getUser);

router.patch("/update", verifyToken, updateUser);

router.post("/logout", logoutUser);

router.get("/encyclopedia", getEncyclopedia);

router.get("/encyclopedia/search", getEncyclopediaByTitle);

router.post("/predict", verifyToken, postPrediction);

router.get("/predict/user", verifyToken, getPredictionsHistory);

module.exports = router;

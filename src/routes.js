require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { registerUser, loginUser, getUser, updateUser, deleteUser, logoutUser } = require("./controller/userController");
const { verifyToken } = require("./middleware/userMiddleware");
const { postPrediction, getPredictionsHistory } = require("./controller/mlController");
const { getEncyclopedia, getEncyclopediaByTitle } = require("./controller/encyclopediaController");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
  });

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/user", verifyToken, getUser);

router.patch("/user/update", verifyToken, updateUser);

router.delete("/user/delete", verifyToken, deleteUser);

router.post("/logout", logoutUser);

router.get("/encyclopedia", getEncyclopedia);

router.get("/encyclopedia/search", getEncyclopediaByTitle);

router.post("/predict", verifyToken, upload.single('image'), postPrediction);

router.get("/predict/user", verifyToken, getPredictionsHistory);

module.exports = router;

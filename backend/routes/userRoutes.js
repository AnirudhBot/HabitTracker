const express = require("express");
const { register, login, addFriend, logout } = require("../controllers/userController");
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/add-friend", authenticateToken, addFriend);

module.exports = router;

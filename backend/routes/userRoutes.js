const express = require("express");
const { register, login, addFriend, logout, searchUser, listFriends } = require("../controllers/userController");
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/search", authenticateToken, searchUser);
router.post("/addFriend", authenticateToken, addFriend);
router.get("/listFriends", authenticateToken, listFriends);

module.exports = router;

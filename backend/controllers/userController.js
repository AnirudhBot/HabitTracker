const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: false, // Accessible by web server and JS both
      secure: process.env.NODE_ENV === "production", // Secure in production (HTTPS only)
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 86400000, // Cookie expiry in milliseconds (1 day)
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

exports.searchUser = async (req, res) => {
  const searchTerm = req.query.query;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
      _id: { $ne: req.user.userId }, // Exclude the current logged-in user
    }).select("username");

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error searching users" });
  }
};

exports.addFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.friends.includes(friend._id)) {
      return res.status(404).json({ message: "Already a friend" });
    }

    user.friends.push(friend._id);
    await user.save();
    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('friends', 'username coins');
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends' });
  }
};

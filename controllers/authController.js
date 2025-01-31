const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.registerUser = async (req, res) => {
  const { firstName, lastName, username, email, phone, password, role, discordId, batchNo } = req.body;

  if (!firstName || !lastName || !username || !email || !phone || !password || !role || !discordId || !batchNo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ firstName, lastName, username, email, phone, password, role, discordId, batchNo });

  if (user) {
    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        discordId: user.discordId,
        batchNo: user.batchNo,
      },
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};


// **User Login**
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.password !== password) { // No hashing, plain text comparison
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // ✅ Send full user details in response
  res.json({
    token: generateToken(user._id),
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      batchNo: user.batchNo, // ✅ Include batchNo
      discordId: user.discordId,
    },
  });
};

// **Get User Profile (No Middleware)**
exports.getUserProfile = async (req, res) => {
  const { token } = req.query; // Pass token as a query parameter
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Send full user details in response
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      batchNo: user.batchNo, // ✅ Include batchNo
      discordId: user.discordId,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// models\userModel.js
const mongoose = require("mongoose");

const roles = ["Admin", "Coordinator", "Advisor", "Student", "Team Lead"];

const batches = [
  "Batch 1", "Batch 2", "Batch 3", "Batch 4", "Batch 5",
  "Batch 6", "Batch 7", "Batch 8", "Batch 9", "Batch 10"
];

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String,  },
    password: { type: String, required: true }, // No hashing, storing as plain text
    role: { type: String, enum: roles, },
    isActive: { type: Boolean, default: true },
    discordId: { type: String,  trim: true },
    profilePicture: { type: String, default: null },
    batchNo: { type: String, enum: batches,}, // ✅ Added Batch Number
    roleData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");           // ✅ correct
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 1. Email Signup
// This route registers a new user
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation: Ensure we have data
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Security: Hash the password so we never store it in plain text
    // "10" is the cost factor (how hard it is to crack)
    const hash = await bcrypt.hash(password, 10);

    // Generate random avatar seed for DiceBear
    const avatarSeed = Math.random().toString(36).substring(2, 15);

    // Create user in Database
    const user = await User.create({
      name: username || null,
      email,
      password: hash,
      avatarSeed,
    });

    // Create a Session Token (JWT)
    const token = createToken(user._id);

    return res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarSeed: user.avatarSeed },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 2. Email/Username Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required" });
    }

    // Try to find user by email OR username (name field)
    const user = await User.findOne({
      $or: [{ email: email }, { name: email }]
    });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email/username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email/username or password" });
    }

    const token = createToken(user._id);

    return res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarSeed: user.avatarSeed },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 3. Google OAuth Login
router.post("/google", async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: "id_token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Generate random avatar seed for new Google users
      const avatarSeed = Math.random().toString(36).substring(2, 15);

      user = await User.create({
        name: name || null,
        email,
        googleId,
        password: null,
        avatarSeed,
      });
    }

    const token = createToken(user._id);

    return res.json({
      message: "Google login successful",
      user: { id: user._id, name: user.name, email: user.email, avatarSeed: user.avatarSeed },
      token,
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }
});

// 4. Logout (client will just delete token; this is here for symmetry)
router.post("/logout", authMiddleware, (req, res) => {
  return res.json({ message: "Logged out successfully" });
});

// Protected route example
router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

// 5. Update User Profile (name and email)
// Protected route that allows users to update their profile information
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, avatarSeed } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name && !email && !avatarSeed) {
      return res.status(400).json({
        message: "At least one field (name, email, or avatarSeed) is required"
      });
    }

    // Email format validation if email is provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatarSeed) updateData.avatarSeed = avatarSeed;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarSeed: updatedUser.avatarSeed
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 6. Change Password
// Protected route that allows users to change their password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required"
      });
    }

    // Check if new password meets requirements
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a password (not Google OAuth user)
    if (!user.password) {
      return res.status(400).json({
        message: "Cannot change password for Google-authenticated accounts"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hash;
    await user.save();

    return res.json({
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 7. Create Admin User (Development/Admin-only endpoint)
// This endpoint allows existing admins to create new admin users
router.post("/admin/create", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required (name, email, password, confirmPassword)"
      });
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Password match validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password: hash,
      role: 'admin', // Set role to admin
    });

    return res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      },
    });
  } catch (err) {
    console.error("Admin creation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
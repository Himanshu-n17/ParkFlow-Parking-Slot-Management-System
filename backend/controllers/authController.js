const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const TempUser = require("../models/TempUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// OTP
exports.sendOtp = async (req, res) => {
  try {
    const { name, email, password, role, phone, adminKey } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    if (role === "admin" && adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        message: "Invalid admin key",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await TempUser.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        adminKey,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
      },
      // { upsert: true, new: true },
      { upsert: true, returnDocument: "after" },
    );

    await sendEmail(email, otp, name);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(404).json({
        message: "OTP expired or not requested",
      });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (tempUser.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      phone: tempUser.phone,
      isVerified: true,
    });

    await TempUser.deleteOne({ email });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Account created successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REGISTER
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role, adminKey, phone, otp } = req.body;

//     const userExists = await User.findOne({ email });

//     // console.log("DB OTP:", userExists?.otp);
//     // console.log("Entered OTP:", otp);
//     // console.log("Expiry:", userExists?.otpExpiry);
//     // console.log("Now:", Date.now());

//     if (userExists && userExists.isVerified) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     if (
//       !userExists ||
//       userExists.otp !== otp.toString() ||
//       userExists.otpExpiry < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     if (!otp) {
//       return res.status(400).json({ message: "OTP is required" });
//     }

//     if (role === "admin" && !adminKey) {
//       return res.status(400).json({ message: "Admin key is required" });
//     }

//     if (role === "admin" && adminKey !== process.env.ADMIN_SECRET) {
//       return res.status(403).json({ message: "Invalid admin key" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     userExists.name = name;
//     userExists.password = hashedPassword;
//     userExists.role = role || "user";
//     userExists.phone = phone;
//     userExists.isVerified = true;
//     userExists.otp = null;
//     userExists.otpExpiry = null;

//     await userExists.save();

//     res.status(201).json({
//       message: "User registered successfully",
//       user: userExists,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No User Found !!!" });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

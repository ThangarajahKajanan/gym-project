const express = require("express");
const { registerUser, loginUser, verifyToken } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get('/verify-token', verifyToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        role: req.user.role, // You can send the user role or other user data if needed
    });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Logged out successfully" });
});

module.exports = router;

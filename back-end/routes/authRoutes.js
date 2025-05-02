const express = require("express");
const { registerUser, loginUser, verifyToken } = require("../controllers/authController");
const router = express.Router();
const upload = require("../middleware/multer"); 



router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.get('/verify-token', verifyToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        role: req.user.role, 
    });
});
router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Logged out successfully" });
});

module.exports = router;

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        let user = await User.findOne({ email });
        let existingUsername  = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });
        if (existingUsername ) return res.status(400).json({ message: "User Name already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ 
            name,
            username, 
            email, 
            password: hashedPassword
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}; */

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        let profileImage;

        if (req.file) {
            profileImage = req.file.path
                .replace(path.resolve(__dirname, "..") + path.sep, "")
                .replace(/\\/g, "/");
        }
          

        let existingUser = await User.findOne({ email });
        let existingUsername = await User.findOne({ username });

        if (existingUser) return res.status(400).json({ message: "User already exists" });
        if (existingUsername) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            name,
            username, 
            email, 
            password: hashedPassword,
            profileImage
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "10h"
        });

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 10 * 60 * 60 * 1000, // 10 hours
        });

        console.log("image profile",  user.profileImage)

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach user information to the request object
        req.user = decoded;
        next();
    });
};

module.exports = { registerUser, loginUser, verifyToken };

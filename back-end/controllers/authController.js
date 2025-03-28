const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        console.log(req.body);

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("came 1", hashedPassword);

        user = await User.create({ 
            name,
            username, 
            email, 
            password: hashedPassword
        });
        console.log("came 2");

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
            expiresIn: "7d"
        });

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true, // Ensure it is not accessible by JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensure it's sent only over HTTPS in production
            sameSite: 'Strict', // Ensure cookie is only sent to same-origin requests
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
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

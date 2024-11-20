"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
            return res.status(400).json({ error: 'All fields are required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (password.length < 6) {
            console.log('Password too short');
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ error: 'Email already registered' });
        }
        const user = new User_1.User({
            email,
            password,
            name,
        });
        await user.save();
        console.log('User created successfully:', { email, name });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
        };
        return res.status(201).json({ user: userResponse, token });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(400).json({ error: 'Error creating user. Please try again.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('Missing login credentials:', { email: !!email, password: !!password });
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
        };
        console.log('User logged in successfully:', email);
        return res.json({ user: userResponse, token });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(400).json({ error: 'Error logging in. Please try again.' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map
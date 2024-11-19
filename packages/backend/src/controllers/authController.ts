import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return res.json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: 'Error logging in' });
  }
};

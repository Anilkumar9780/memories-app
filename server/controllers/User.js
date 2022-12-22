import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// user schema 
import User from '../models/UserSchema.js';

/**
 *  signin user 
 * @param {object} req 
 * @param {object} res 
 * @returns node
 */
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist. " });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went worng!" });
    }
};

/**
 * sign up user
 * @param {object} req 
 * @param {object} res 
 * @returns node
 */
export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(404).json({ message: "User doesn't exist." });
        if (password == confirmPassword) return res.status(400).json({ message: "Passwords don't match." });
        const hashedpassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: hashedpassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });
        res.status(200).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: "Something went worng!" });
    }
};
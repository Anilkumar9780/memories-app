import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import crypto from 'crypto';
import nodemailer from "nodemailer";

// user schema 
import User from '../models/UserSchema.js';
import PostMessage from '../models/PostSchema.js';

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "0f45935271d9bd",
        pass: "6f7e0e80034c77",
        accessToken: '2df60aa5f5afb687f7ddeb64b96a4a04',
    },
    secure: false,
    tls: { ciphers: 'SSLv3' }
});



const router = express.Router();

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
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '1h' });
        const user = existingUser.toObject();
        delete user.password;
        res.status(200).json({ result: user, token, message: "Sign In successfuly" });
    } catch (error) {
        res.status(404).json({ message: "Something went worng!", data: error.message });
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
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });
        const hashedpassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: hashedpassword, name: `${firstName} ${lastName}` });
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });
        res.status(200).json({ result, token, message: "Sign Up successfuly" });
    } catch (error) {
        res.status(404).json({ message: "Something went worng!", data: error.message });
    }
};

/**
 * get uers profile 
 * @param {obj} req 
 * @param {obj} res 
 */
export const userProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
        const post = await PostMessage.find({ postedBy: id });
        res.status(200).json({ user, post });
    } catch (error) {
        res.status(404).json({ message: "User not found", data: error.message })
    }
};

/**
 * user search profile
 * @param {obj} req 
 * @param {obj} res 
 */
export const searchUser = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        let userPattern = new RegExp("^" + searchQuery);
        const user = await User.find({ name: { $regex: userPattern } }).select("_id name");
        res.status(200).json({ user })
    } catch (error) {
        res.status(404).json({ message: "User not found", data: error.message })
    }
};

/**
 * following , followers user by  userid
 * @param {object} req 
 * @param {object} res 
 * @returns array
 */
export const followUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.followId)) {
            return res.status(404).json({ message: 'Invalid ID' })
        }
        if (req.body.user._id === req.body.followId) {
            return res.status(400).json({ message: 'You cannot follow yourself' })
        }
        const user = await User.findById(req.body.followId);
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }
        if (user.followers.indexOf(req.body.user._id) !== -1) {
            return res.status(400).json({ message: `You're already following ${user.name}` });
        }
        user.followers.addToSet(req.body.user._id);
        await user.save();
        const users = await User.findById(req.body.user._id);
        users.following.addToSet(user._id);
        await users.save();
        res.status(200).send({ user, users, message: `You have sucessfully followed ${user.name}` })
    } catch (error) {
        res.status(404).send({ message: "User Follow Failed", data: error.message })
    }

};

/**
 * unfollow user by user id
 * @param {object} req 
 * @param {object} res 
 */
export const unfollowUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.unFollowId)) {
            return res.status(404).json({ message: 'Invalid ID' })
        }
        if (req.body.user._id === req.body.followId) {
            return res.status(400).json({ message: 'You cannot unfollow yourself' })
        }
        const user = await User.findById(req.body.unFollowId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const following = user.followers.indexOf(req.body.user._id);
        if (following === -1) {
            return res.status(400).json({ message: `You're not following ${user.username}` });
        }
        user.followers.splice(following, 1);
        await user.save();
        const userLogged = await User.findById(req.body.user._id);
        const positionUnfollow = userLogged.following.indexOf(user._id);
        userLogged.following.splice(positionUnfollow, 1);
        await userLogged.save();
        res.status(200).send({ userLogged, user, message: `You have sucessfully unfollowed ${user.name}` })
    } catch (error) {
        res.status(404).send({ message: "User UnFollow Failed", data: error.message });
    }
};

/**
 * reset password 
 * @param {object} req 
 * @param {object} res 
 */
export const resetPassword = async (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return console.log(err)
            }
            const token = buffer.toString("hex")
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' })
            }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();
            let link = "http://" + req.headers.host + "/user/new-password/" + user.resetPasswordToken;
            const mailOptions = {
                to: user.email,
                from: 'memoriesYour@gmail.com',
                subject: "Password change request",
                text: `Hi ${user.name} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log(info);
                return res.status(200).json({ user, message: 'A reset email has been sent to ' + user.email + '.', message_id: info.messageId });
            });
        })
    } catch (error) {
        res.status(404).send({ message: "Internal server error", data: error.message });
    }
}

/**
 * change password
 * @param {object} req 
 * @param {object} res 
 */
export const changePassword = async (req, res) => {
    try {
        const newPassword = req.body.password;
        const sendToken = req.body.token;
        const user = await User.findOne({ resetPasswordToken: sendToken, resetPasswordExpires: { $gt: Date.now() } })
        if (!user) {
            return res.status(422).json({ message: "Try again session expired" })
        }
        const hashedpassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedpassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "Password updated success" })
    } catch (error) {
        res.status(404).send({ message: "Internal server error", data: error.message });
    }
};


export const getFollowingPost = async (req, res) => {
    try {
        const subPosts = PostMessage.find({ postedBy: { $in: req.body.user.following } }).populate("postedBy", "_id name").populate("comments.postedBy", "_id name").sort('-createdAt');
        res.status(200).json({ subPosts });
    } catch (error) {
        res.status(404).send({ message: "Internal server error", data: error.message });
    }
};


export default router;
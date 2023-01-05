import express from 'express';
import mongoose from 'mongoose';

// component Postmessage Schema
import PostMessage from '../models/PostSchema.js';

// router 
const router = express.Router();

/**
 * get all posts route
 * @param {object} req 
 * @param {object} res 
 */
export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({})
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
};

/**
 * get posts by id route
 * @param {object} req 
 * @param {object} res 
 */
export const getPostDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
};

/**
 * get post by search
 * @param {object} req 
 * @param {object} res 
 */
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [{ title: title }, { tags: { $in: tags.split(',') } }] });
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
}

/**
 * create post route
 * @param {object} req 
 * @param {object} res 
 */
export const createPost = async (req, res) => {
    const fromData = req.body;
    const reqFiles = [];
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push('uploads/' + req.files[i].filename)
    }
    const newPostMessage = new PostMessage({
        ...fromData,
        file: reqFiles,
        creator: req.userId,
        postedBy: req.userId,
        createdAt: new Date().toISOString()
    });
    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage, { message: "Create post successfuly" });
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
}


/**
 * update post data
 * @param {object} req 
 * @param {object} res 
 * @returns node
 */
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, creator, selectedFile, tags } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
        await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
        res.json(updatedPost, { message: "Update successfully" });
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
}

/**
 * delete post 
 * @param {object} req 
 * @param {object} res 
 * @returns node
 */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send({ message: `No post with id: ${id}` });
        await PostMessage.findByIdAndRemove(id);
        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
}

/**
 * like post by user id
 * @param {object} req 
 * @param {object} res 
 */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.userId) return res.json({ message: "Unauthenticated !." })
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send({ message: `No post with id: ${id}` });
        const post = await PostMessage.findById(id);
        const index = post.likes.findIndex((id) => id == String(req.userId));
        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
};

/**
 * comment post by user
 * @param {object} req 
 * @param {object} res 
 */
export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        const post = await PostMessage.findById(id);
        post.comments.push(value);
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({ message: "Internal server error!", data: error.message });
    }
};


export default router;

















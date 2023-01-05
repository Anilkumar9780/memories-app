import mongoose from 'mongoose';

// mongoose schema
const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: false,
        max: 255
    },
    message: {
        type: String,
        required: false,
        max: 255
    },
    name: {
        type: String,
        required: false,
        max: 255
    },
    tags: {
        type: [String],
        required: false,
        max: 255
    },
    file: {
        type: Array
    },
    likes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    postedBy: {
        type: String,
        ref: 'User'
    }
}, { timestamps: true })

// mongoose create modle
let PostMessage = mongoose.model('postmessages', postSchema);

export default PostMessage;
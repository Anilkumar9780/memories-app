import mongoose from 'mongoose';

// mongoose schema
const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name:String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],                                                            
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

// mongoose create modle
let PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
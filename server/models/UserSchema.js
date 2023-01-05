import mongoose from 'mongoose';

// mongoose schema
const userSchema = mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        max: 100
    },
    followers: {
        type: [String],
        ref: 'User'
    },
    following: {
        type: [String],
        ref: 'User'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true })

// mongoose create modle
let user = mongoose.model('users', userSchema);

export default user;
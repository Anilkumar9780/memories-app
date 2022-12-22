import mongoose from 'mongoose';

// mongoose schema
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
})

// mongoose create modle
let user = mongoose.model('users', userSchema);

export default user;
/**
 * Message Model
 * Handles contact form submissions
 */

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    subject: {
        type: String,
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    read: {
        type: Boolean,
        default: false
    },
    replied: {
        type: Boolean,
        default: false
    },
    ip: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
messageSchema.index({ read: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);

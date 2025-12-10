/**
 * User Model
 * Handles user authentication data
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    role: {
        type: String,
        enum: ['admin', 'viewer'],
        default: 'admin'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    refreshToken: {
        type: String
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ verificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Don't return sensitive fields in JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.verificationToken;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    delete user.__v;
    return user;
};

export default mongoose.models.User || mongoose.model('User', userSchema);

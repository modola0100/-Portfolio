/**
 * Experience Model
 * Handles work experience data
 */

import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        maxlength: [100, 'Role cannot exceed 100 characters']
    },
    period: {
        type: String,
        required: [true, 'Period is required']
    },
    logo: {
        type: String
    },
    tasks: [{
        type: String
    }],
    current: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for sorting
experienceSchema.index({ order: 1, current: -1 });

export default mongoose.models.Experience || mongoose.model('Experience', experienceSchema);

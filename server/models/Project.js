/**
 * Project Model
 * Handles portfolio projects data
 */

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    shortDesc: {
        type: String,
        required: [true, 'Short description is required'],
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    longDesc: {
        type: String,
        required: [true, 'Full description is required']
    },
    github: {
        type: String,
        trim: true
    },
    liveDemo: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    cover: {
        type: String,
        required: [true, 'Cover image is required']
    },
    gallery: [{
        type: String
    }],
    featured: {
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
projectSchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);

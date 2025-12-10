/**
 * Skill Model
 * Handles skills/technologies data
 */

import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    icon: {
        type: String,
        required: [true, 'Icon is required']
    },
    category: {
        type: String,
        enum: ['frontend', 'backend', 'mobile', 'database', 'tools', 'other'],
        default: 'other'
    },
    proficiency: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for sorting
skillSchema.index({ order: 1, category: 1 });

export default mongoose.models.Skill || mongoose.model('Skill', skillSchema);

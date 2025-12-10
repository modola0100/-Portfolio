/**
 * GeneralSettings Model
 * Handles portfolio general configuration (profile, contact, stats, SEO)
 */

import mongoose from 'mongoose';

const generalSettingsSchema = new mongoose.Schema({
    // Profile Section
    heroName: {
        type: String,
        default: 'Mohamed Adel'
    },
    subtitle: {
        type: String,
        default: 'Flutter Developer'
    },
    profilePicture: {
        type: String
    },

    // About Section
    aboutText: {
        type: String
    },

    // Contact Information
    contact: {
        location: { type: String },
        phone: { type: String },
        email: { type: String },
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String }
    },

    // Statistics
    stats: {
        projectsCount: { type: Number, default: 0 },
        yearsExperience: { type: Number, default: 0 },
        happyClients: { type: Number, default: 0 }
    },

    // SEO Settings
    seo: {
        metaTitle: { type: String },
        metaDescription: { type: String },
        keywords: [{ type: String }]
    },

    // Resume
    resumeUrl: {
        type: String
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
generalSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.models.GeneralSettings || mongoose.model('GeneralSettings', generalSettingsSchema);

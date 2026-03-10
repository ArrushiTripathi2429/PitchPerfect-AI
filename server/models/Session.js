const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: { type: String, required: true, trim: true },
    tone: { type: String, trim: true, default: 'professional' },
    length: { type: String, trim: true, default: 'medium' },
    language: { type: String, trim: true, default: 'en' },
    script: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);


const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,       
      required: true,
      index: true,       
    },
    userEmail: {
      type: String,
      default: null,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    analysisData: {
      seconds:        { type: Number, default: 0 },
      wordCount:      { type: Number, default: 0 },
      wpm:            { type: Number, default: 0 },
      fillerCount:    { type: Number, default: 0 },
      currentEmotion: { type: String, default: "neutral" },
      postureScore:   { type: Number, default: 100 },
      voiceCracks:    { type: Number, default: 0 },
      eyeContact:     { type: Boolean, default: true },
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);

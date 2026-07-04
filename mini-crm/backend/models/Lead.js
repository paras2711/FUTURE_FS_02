const mongoose = require('mongoose');

// Schema for client leads
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the client name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide the client email address'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  source: {
    type: String,
    required: [true, 'Please specify the lead source'],
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);

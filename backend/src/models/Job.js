const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Data', 'Other']
  },
  stack: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);

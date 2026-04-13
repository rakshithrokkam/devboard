const Job = require('../models/Job');
const { matchFilters } = require('../sockets/socket');

exports.getJobs = async (req, res) => {
  try {
    const { role, stack } = req.query;
    let query = {};
    
    if (role && role !== 'All') {
      query.role = role;
    }
    
    if (stack) {
      const stackArray = stack.split(',');
      if (stackArray.length > 0 && stackArray[0] !== '') {
        query.stack = { $in: stackArray };
      }
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();

    // Broadcast to sockets that match the filter
    const io = req.app.get('io');
    if (io) {
      const sockets = await io.fetchSockets();
      sockets.forEach((socket) => {
        if (socket.filters && matchFilters(savedJob, socket.filters)) {
          io.to(socket.id).emit('new_job_alert', savedJob);
        } else if (!socket.filters || Object.keys(socket.filters).length === 0) {
          // If no filters set, optionally notify all or keep quiet
          io.to(socket.id).emit('new_job_alert', savedJob);
        }
      });
    }

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Client can subscribe to active filters
    socket.on('subscribe_filters', (filters) => {
      console.log(`Socket ${socket.id} subscribed to filters:`, filters);
      socket.filters = filters; 
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

// Helper function to check if a job matches socket filters
module.exports.matchFilters = (job, filters) => {
  if (!filters) return false;
  
  // Example matching logic:
  // If user filtered by role, check role match
  if (filters.role && filters.role !== 'All' && job.role !== filters.role) return false;
  
  // If user filtered by stack (array), check if job stack contains at least one
  if (filters.stack && filters.stack.length > 0) {
    const hasStackMatch = filters.stack.some(s => job.stack.includes(s));
    if (!hasStackMatch) return false;
  }
  
  return true;
};

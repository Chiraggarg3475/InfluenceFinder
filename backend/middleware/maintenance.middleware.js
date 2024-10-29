let maintenanceMode = false; // Change to true for maintenance

exports.maintenance = (req, res, next) => {
  if (maintenanceMode) {
    return res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
  }
  next();
};

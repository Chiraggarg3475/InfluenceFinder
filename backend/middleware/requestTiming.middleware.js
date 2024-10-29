exports.requestTiming = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`Request to ${req.originalUrl} took ${duration}ms`);
    });
    next();
  };
  
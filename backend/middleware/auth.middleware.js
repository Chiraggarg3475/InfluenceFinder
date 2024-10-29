const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
};

exports.adminOnly = (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

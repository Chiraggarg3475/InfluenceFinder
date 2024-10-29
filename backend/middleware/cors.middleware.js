const cors = require('cors');

exports.corsOptions = cors({
  origin: process.env.CORS_ORIGIN || '*', // Specify allowed origin(s)
  optionsSuccessStatus: 200,
});

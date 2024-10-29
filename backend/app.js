require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { logger } = require('./middleware/logging.middleware');
const { corsOptions } = require('./middleware/cors.middleware');
const { limiter } = require('./middleware/rateLimit.middleware');
const { setSecurityHeaders } = require('./middleware/securityHeaders.middleware');
const { requestTiming } = require('./middleware/requestTiming.middleware');
const { sessionMiddleware } = require('./middleware/session.middleware');
const { errorHandler } = require('./middleware/error.middleware');
const userRoutes = require('./routes/user.routes');
const influencerProfileRoutes = require('./routes/influencerProfile.routes');
const wishlistRoutes = require('./routes/wishlist.routes');

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware setup
app.use(express.json());
app.use(logger);
app.use(corsOptions);
app.use(limiter);
app.use(setSecurityHeaders);
app.use(requestTiming);
app.use(sessionMiddleware);

// Route setup
app.use('/api/users', userRoutes);
app.use('/api/influencer-profiles', influencerProfileRoutes);
app.use('/api/wishlists', wishlistRoutes);

// Error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

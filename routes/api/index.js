const express = require('express');
const router = express.Router();
// Import user and thought routes
const userRoutes = require('./userRoute'); 
const thoughtRoutes = require('./thoughtRoute'); 
// Define API routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
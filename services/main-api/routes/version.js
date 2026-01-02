const express = require('express');
const router = express.Router();
const packageJson = require('../package.json');

/**
 * Returns Main API version information
 * Used for monitoring and included in all API responses
 */
router.get('/version', (req, res) => {
  res.status(200).json({
    service: packageJson.name,
    version: packageJson.version,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    uptime: process.uptime()
  });
});

module.exports = router;
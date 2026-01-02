// Description: Version information endpoint
// Returns service name, version, and environment

const express = require('express');
const router = express.Router();

// Version is loaded from package.json
const packageJson = require('../package.json');

/**
 * GET /version
 * Returns version information about the service
 * Used by main-api to include in all responses
 */
router.get('/version', (req, res) => {
  res.status(200).json({
    service: packageJson.name,               // "auxiliary-service"
    version: packageJson.version,            // "1.0.0"
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,            // Node.js version
    uptime: process.uptime()                 // Seconds since service started
  });
});

module.exports = router;
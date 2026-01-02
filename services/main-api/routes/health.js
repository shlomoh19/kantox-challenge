const express = require('express');
const router = express.Router();

/**
 * Health check endpoint for Kubernetes probes
 * Returns simple status - doesn't check dependencies
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'main-api',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
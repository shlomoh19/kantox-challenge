// Description: Health check endpoint for Kubernetes probes
// Returns 200 OK if service is running

const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Health check endpoint
 * Used by Kubernetes readiness and liveness probes
 */
router.get('/health', (req, res) => {
  // In production, you might check:
  // - Database connections
  // - AWS connectivity
  // - Memory usage
  // For now, simple response is sufficient
  
  res.status(200).json({
    status: 'healthy',
    service: 'auxiliary-service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
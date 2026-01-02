const express = require('express');
const router = express.Router();
const auxiliaryClient = require('../lib/auxiliary-client');
const packageJson = require('../package.json');

/**
 * GET /api/buckets
 * Lists S3 buckets with aggregated version info
 * 
 * Response format (Kantox requirement):
 * {
 *   success: true,
 *   data: { buckets: [...] },
 *   versions: {
 *     main-api: "1.0.0",
 *     auxiliary-service: "1.0.0"
 *   }
 * }
 */
router.get('/api/buckets', async (req, res) => {
  try {
    // Make TWO calls to Auxiliary Service
    const bucketsData = await auxiliaryClient.getBuckets();
    const auxiliaryVersion = await auxiliaryClient.getVersion();
    
    // Kantox requirement: Include versions from BOTH services
    res.status(200).json({
      success: true,
      data: bucketsData,
      versions: {
        'main-api': packageJson.version,
        'auxiliary-service': auxiliaryVersion.version
      }
    });
    
  } catch (error) {
    console.error('Error in /api/buckets:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buckets',
      message: error.message
    });
  }
});

/**
 * GET /api/parameters
 * Retrieves SSM parameters with aggregated version info
 * Query param: path (e.g., /api/parameters?path=/kantox)
 */
router.get('/api/parameters', async (req, res) => {
  try {
    const path = req.query.path || '/';
    
    // Make TWO calls to Auxiliary Service
    const paramsData = await auxiliaryClient.getParameters(path);
    const auxiliaryVersion = await auxiliaryClient.getVersion();
    
    // Kantox requirement: Include versions
    res.status(200).json({
      success: true,
      data: paramsData,
      versions: {
        'main-api': packageJson.version,
        'auxiliary-service': auxiliaryVersion.version
      }
    });
    
  } catch (error) {
    console.error('Error in /api/parameters:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parameters',
      message: error.message
    });
  }
});

module.exports = router;
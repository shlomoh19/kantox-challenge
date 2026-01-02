// Description: AWS integration endpoints
// Provides access to S3 and SSM operations

const express = require('express');
const router = express.Router();
const { listS3Buckets, getSSMParameters } = require('../lib/aws-client');

/**
 * GET /aws/buckets
 * Lists all S3 buckets in the AWS account
 * Returns bucket names and creation dates
 */
router.get('/aws/buckets', async (req, res) => {
  try {
    // Call AWS client (this is an async operation)
    const buckets = await listS3Buckets();
    
    // Transform data for cleaner response
    const bucketList = buckets.map(bucket => ({
      name: bucket.Name,
      creationDate: bucket.CreationDate
    }));
    
    // Send success response
    res.status(200).json({
      success: true,
      count: bucketList.length,
      buckets: bucketList
    });
    
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching S3 buckets:', error.message);
    
    // Send error response to client
    res.status(500).json({
      success: false,
      error: 'Failed to fetch S3 buckets',
      message: error.message
    });
  }
});

/**
 * GET /aws/parameters
 * Retrieves parameters from AWS SSM Parameter Store
 * Query parameter: path (optional, defaults to '/')
 * Example: /aws/parameters?path=/app/config
 */
router.get('/aws/parameters', async (req, res) => {
  try {
    // Get path from query parameter or use default
    const path = req.query.path || '/';
    
    // Call AWS client
    const parameters = await getSSMParameters(path);
    
    // Transform data for cleaner response
    const paramList = parameters.map(param => ({
      name: param.Name,
      value: param.Value,
      type: param.Type,
      lastModified: param.LastModifiedDate
    }));
    
    // Send success response
    res.status(200).json({
      success: true,
      path: path,
      count: paramList.length,
      parameters: paramList
    });
    
  } catch (error) {
    console.error('Error fetching SSM parameters:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SSM parameters',
      message: error.message
    });
  }
});

module.exports = router;
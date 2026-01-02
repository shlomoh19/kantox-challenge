// Description: HTTP client for calling Auxiliary Service
// This abstracts HTTP communication, making routes cleaner

const axios = require('axios');

// Service URL - will be different in Kubernetes vs local
const AUXILIARY_URL = process.env.AUXILIARY_SERVICE_URL || 'http://localhost:3001';

/**
 * Fetches S3 buckets from Auxiliary Service
 * @returns {Promise<Object>} Bucket data from AWS
 */
async function getBuckets() {
  try {
    const response = await axios.get(`${AUXILIARY_URL}/aws/buckets`);
    return response.data;
  } catch (error) {
    console.error('Error calling auxiliary service /aws/buckets:', error.message);
    throw new Error('Failed to fetch buckets from auxiliary service');
  }
}

/**
 * Fetches SSM parameters from Auxiliary Service
 * @param {string} path - Parameter path prefix
 * @returns {Promise<Object>} Parameter data from AWS
 */
async function getParameters(path = '/') {
  try {
    const response = await axios.get(`${AUXILIARY_URL}/aws/parameters`, {
      params: { path }  // Query parameter: ?path=/kantox
    });
    return response.data;
  } catch (error) {
    console.error('Error calling auxiliary service /aws/parameters:', error.message);
    throw new Error('Failed to fetch parameters from auxiliary service');
  }
}

/**
 * Fetches version info from Auxiliary Service
 * @returns {Promise<Object>} Version information
 */
async function getVersion() {
  try {
    const response = await axios.get(`${AUXILIARY_URL}/version`);
    return response.data;
  } catch (error) {
    console.error('Error calling auxiliary service /version:', error.message);
    throw new Error('Failed to fetch version from auxiliary service');
  }
}

module.exports = {
  getBuckets,
  getParameters,
  getVersion
};
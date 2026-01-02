// Description: AWS SDK wrapper for S3 and SSM operations
// This centralizes all AWS interactions for easier testing and maintenance

const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { SSMClient, GetParametersByPathCommand } = require('@aws-sdk/client-ssm');

// Initialize AWS clients
// Region comes from environment variable or defaults to us-east-1
const region = process.env.AWS_REGION || 'us-east-1';

const s3Client = new S3Client({ region });
const ssmClient = new SSMClient({ region });

/**
 * Lists all S3 buckets in the AWS account
 * @returns {Promise<Array>} Array of bucket objects
 */
async function listS3Buckets() {
    try {
      const command = new ListBucketsCommand({});
      const response = await s3Client.send(command);
          // Means:
    // 1. Send HTTP request to AWS S3 API
    // 2. s3Client.send() returns a Promise immediately
    // 3. await pauses this function until Promise resolves
    // 4. When AWS responds, Promise resolves with data
    // 5. response gets the actual data (not the Promise)
    // 6. Function continues to next line
      return response.Buckets || [];
    } catch (error) {
        // If Promise rejects (AWS call fails), catch block runs
      console.error('Error listing S3 buckets:', error);
      throw error; // Re-throws the error to be handled by the caller
    }
  }

  /**
 * Gets parameters from AWS Systems Manager Parameter Store
 * @param {string} path - Parameter path prefix (e.g., '/app/')
 * @returns {Promise<Array>} Array of parameter objects
 */
async function getSSMParameters(path = '/') {
    try {
      const command = new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true  // Decrypt SecureString parameters
      });
      const response = await ssmClient.send(command);
      return response.Parameters || [];
    } catch (error) {
      console.error('Error getting SSM parameters:', error);
      throw error;
    }
  }

  module.exports = {
    listS3Buckets,
    getSSMParameters
  };
// Description: Auxiliary Service - Main entry point
// Handles AWS integration for the Kantox challenge

const express = require('express');
const app = express();

// Import route handlers
const healthRoutes = require('./routes/health');
const versionRoutes = require('./routes/version');
const awsRoutes = require('./routes/aws');

// Configuration
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';  // Listen on all network interfaces (important for Docker!)

// Middleware: Parse JSON request bodies
app.use(express.json());

// Middleware: Log all requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();  // Pass to next middleware/route
});

// Register routes
app.use(healthRoutes);      // Mounts: /health
app.use(versionRoutes);     // Mounts: /version
app.use(awsRoutes);         // Mounts: /aws/*

// Root endpoint (informational)
app.get('/', (req, res) => {
  res.json({
    service: 'auxiliary-service',
    message: 'AWS Integration Service for Kantox Challenge',
    endpoints: {
      health: '/health',
      version: '/version',
      buckets: '/aws/buckets',
      parameters: '/aws/parameters?path=/your/path'
    }
  });
});

// 404 handler (catch-all for undefined routes)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'Endpoint does not exist'
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log('Auxiliary Service Started');
  console.log(`Listening on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log('=================================');
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
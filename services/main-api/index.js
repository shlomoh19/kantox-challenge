const express = require('express');
const app = express();

// Import routes
const healthRoutes = require('./routes/health');
const versionRoutes = require('./routes/version');
const apiRoutes = require('./routes/api');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // For Kubernetes networking

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Register routes
app.use(healthRoutes);
app.use(versionRoutes);
app.use(apiRoutes);

// Root endpoint (documentation)
app.get('/', (req, res) => {
  res.json({
    service: 'main-api',
    message: 'Kantox Main API - User-facing service',
    endpoints: {
      health: '/health',
      version: '/version',
      buckets: '/api/buckets',
      parameters: '/api/parameters?path=/your/path'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log('Main API Started');
  console.log(`Listening on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Auxiliary Service URL: ${process.env.AUXILIARY_SERVICE_URL || 'http://localhost:3001'}`);
  console.log('=================================');
});

// Graceful shutdown for Kubernetes
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

// CI/CD Test 222

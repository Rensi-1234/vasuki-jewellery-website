import http from 'node:http';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server;
let isShuttingDown = false;

async function startServer() {
  await connectDatabase();

  server = http.createServer(app);
  server.listen(env.port, () => {
    console.info(`VASUKI API listening on http://localhost:${env.port}`);
  });
}

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.info(`${signal} received. Shutting down gracefully.`);

  if (!server) {
    process.exitCode = 0;
    return;
  }

  server.close(async (error) => {
    if (error) {
      console.error('Error closing HTTP server:', error.message);
      process.exitCode = 1;
    }

    try {
      const mongoose = await import('mongoose');
      await mongoose.default.disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting MongoDB:', disconnectError.message);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Unable to start VASUKI API:', error.message);
  process.exitCode = 1;
});
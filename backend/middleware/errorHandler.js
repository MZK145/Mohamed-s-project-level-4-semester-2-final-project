// middleware/errorHandler.js

/**
 * Central error handler for the Express app.
 * Logs the error and sends a consistent JSON response.
 */
module.exports = (err, req, res, next) => {
  // Log the full error stack (for debugging)
  console.error('❌ Error:', err.stack || err.message || err);

  // Determine status code (default 500)
  const status = err.status || err.statusCode || 500;

  // Build error message:
  // - In production, hide internal details (send generic message)
  // - In development, send the actual error message
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Something went wrong';

  // If it's a validation error from express-validator, we might have additional info
  if (err.errors && Array.isArray(err.errors)) {
    // For validation errors, we can send the first message
    const firstError = err.errors[0]?.msg || message;
    return res.status(400).json({ error: firstError });
  }

  // Send JSON error response
  res.status(status).json({ error: message });
};
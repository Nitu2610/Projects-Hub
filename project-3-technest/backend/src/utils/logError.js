// Error logging helper function for debugging and tracing errors.

const logError = (err) => {
  console.error("📍 Type:", err.name);
  console.error("❌ Error:", err.message);
  console.error("📚 Stack:", err.stack);
};

module.exports = logError;

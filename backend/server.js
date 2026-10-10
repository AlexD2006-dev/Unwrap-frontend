const express = require("express");

// Create the app separately from server startup so tests can import it directly.
const app = express();

// This route confirms that the backend is running.
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Export the app so Supertest can test it without starting a real server.
module.exports = app;
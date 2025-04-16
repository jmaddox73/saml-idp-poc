const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3443;

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
// HTTPS server options
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private.key")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.crt")),
};

// Start HTTPS server
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server is running at https://localhost:${PORT}`);
});

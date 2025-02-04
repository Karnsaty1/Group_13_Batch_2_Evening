const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === "/") {
    serveStaticFile(res, "public/index.html", "text/html");
  } else if (req.url === "/questions") {
    const filePath = path.join(__dirname, "questions.json");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading questions.json:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Failed to load questions" }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  } else {
    serveStaticFile(res, `public${req.url}`, getContentType(req.url)); // Fixed syntax error
  }
});

function serveStaticFile(res, filePath, contentType) {
  fs.readFile(path.join(__dirname, filePath), (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
}

function getContentType(url) {
  const ext = path.extname(url);
  switch (ext) {
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".json":
      return "application/json";
    default:
      return "text/html";
  }
}

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Fixed template literal

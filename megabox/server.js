const express = require("express");
const path = require("path");
const url = require("url");
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Parse the URL and check if it is a Branch.io URL
const isBranchUrl = (reqUrl) => {
  try {
    const parsedUrl = new URL(reqUrl, `http://${reqUrl.host || "localhost"}`);
    return parsedUrl.hostname.includes("wzhu2.test-app.link") || 
           parsedUrl.hostname.includes("wzhu2.app.link");
  } catch (e) {
    return false;
  }
};

// Middleware to handle Branch.io URLs
app.use((req, res, next) => {
  const originalUrl = req.originalUrl;
  
  if (originalUrl.includes("wzhu2.test-app.link") || originalUrl.includes("wzhu2.app.link")) {
    // Extract file ID from the URL
    const pathParts = originalUrl.split("/");
    const fileId = pathParts[pathParts.length - 1].split("?")[0];
    
    if (fileId) {
      res.redirect(`/preview/${fileId}`);
    } else {
      res.redirect("/");
    }
  } else {
    next();
  }
});

// Handle preview URLs
app.get("/preview/:fileId", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// All remaining requests return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

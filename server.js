const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// 移除 nextApp.prepare() 包装
app.prepare().then(() => {
  const server = express();

  console.log("Starting integrated server...");

  // Middleware to log incoming requests
  server.use((req, res, nextMiddleware) => {
    console.log(`[Express] Received request for ${req.url}`);
    nextMiddleware();
  });

  // Add this condition to exclude /dev path from proxy
  server.use((req, res, next) => {
    if (req.url.startsWith("/dev")) {
      return handle(req, res);
    }
    next();
  });

  // Proxy setup for '/' path (excluding /dev)
  server.use(
    "/",
    createProxyMiddleware({
      target: "https://hong.greatdk.com/",
      changeOrigin: true,
      logLevel: "debug",
      onProxyReq: (proxyReq, req, res) => {
        const { method, url, headers } = req;
        console.log(`[Proxy] Proxying ${method} ${url}`);
        console.log("Request headers:", JSON.stringify(headers, null, 2));

        if (method === "POST") {
          let bodyData = "";
          req.on("data", (chunk) => {
            bodyData += chunk.toString();
          });
          req.on("end", () => {
            console.log("Request body:", bodyData);
          });
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] Received response for ${req.method} ${req.url}`);
        console.log("Response Status Code:", proxyRes.statusCode);
        console.log(
          "Response Headers:",
          JSON.stringify(proxyRes.headers, null, 2)
        );

        // Modify response headers to allow cross-origin access
        proxyRes.headers["Access-Control-Allow-Origin"] =
          "http://localhost:30000";
        proxyRes.headers["Access-Control-Allow-Methods"] =
          "GET, POST, PUT, DELETE, OPTIONS";
        proxyRes.headers["Access-Control-Allow-Headers"] =
          "Content-Type, Authorization";

        // Log additional info for API requests
        if (req.url.includes("/api/")) {
          console.log(`Request URL: ${req.url}`);
          console.log(`Request Method: ${req.method}`);
          console.log(`Status Code: ${proxyRes.statusCode}`);
          console.log(`Remote Address: ${req.connection.remoteAddress}`);
        }

        // Remove Content-Security-Policy header
        delete proxyRes.headers["content-security-policy"];
      },
      pathRewrite: {
        "^/": "/", // Rewrite '/hong' to '/' for the target server
      },
    })
  );

  // Handle all other routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // 根据环境变量选择端口
  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${port}`);
  });

  // Error handling
  server.on("error", (error) => {
    console.error("An error occurred:", error);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
  });
});

// apiPrefixMiddleware.js
const apiPrefixMiddleware = (req, res, next) => {
  console.log("Middleware applied to:", req.method, req.path);
  
  if (!req.url.startsWith('/api/v1')) {
    req.url = `/api/v1${req.url}`;
  }

  console.log("Modified Request URL:", req.method, req.url);
  next();
};

export default apiPrefixMiddleware;
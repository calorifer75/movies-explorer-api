const NodeRateLimiter = require('node-rate-limiter');

// NodeRateLimiter.defaults.expiration = 60000;
// NodeRateLimiter.defaults.rateLimit = 1;

const nodeRateLimiter = new NodeRateLimiter();

function requestRateLimitMiddleware(req, res, next) {
  nodeRateLimiter.get(req.ip, (err, limit) => {
    if (err) {
      return next(err);
    }

    if (limit.remaining) {
      return next();
    }

    return res.status(429).send(
      `Rate limit exceeded, retry in ${NodeRateLimiter.defaults.expiration} ms`,
    );
  });
}

module.exports = requestRateLimitMiddleware;

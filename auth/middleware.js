const redisClient = require("../database/Redis");

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const client = await redisClient();
    const userData = await client.get(`auth:${token}`);
    if (!userData) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = JSON.parse(userData);
    next();
}

function adminMiddleware(req, res, next) {
    if (!req.user || req.user.is_admin !== true) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

module.exports = { authMiddleware, adminMiddleware };
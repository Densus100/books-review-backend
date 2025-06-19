module.exports = (router) => {
    const redisClient = require("../database/Redis");
    const { Users, Roles } = require("../database/Sequelize").models;
    const generateToken = require("../utils/token");

    // Login route
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        // Find user with role
        const user = await Users.findOne({
            where: { username },
            include: [{ model: Roles, as: 'role' }]
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const token = generateToken();
        // Save to Redis
        const client = await redisClient();
        const userInfo = {
            id: user.id,
            username: user.username,
            role: user.role ? user.role.name : null,
            is_admin: user.role ? user.role.is_admin : false,
            token
        };
        await client.set(`auth:${token}`, JSON.stringify(userInfo), { EX: 3600 }); // 1 hour expiry

        res.json({ token });
    });

    // Protected route example
    router.get('/me', async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const client = await redisClient();
        const userData = await client.get(`auth:${token}`);
        if (!userData) return res.status(401).json({ error: 'Invalid token' });

        // Fetch user and role from DB to get is_admin
        const parsed = JSON.parse(userData);
        const { Users, Roles } = require("../database/Sequelize").models;
        const user = await Users.findOne({
            where: { id: parsed.id },
            include: [{ model: Roles, as: 'role' }]
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id: user.id,
            username: user.username,
            role: user.role ? user.role.name : null,
            is_admin: user.role ? user.role.is_admin : false,
            token
        });
    });

}
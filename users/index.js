const { Users, Roles } = require('../database/Sequelize').models;
const { authMiddleware, adminMiddleware } = require('../auth/middleware');

module.exports = (router) => {
    // List all users (admin only)
    router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const users = await Users.findAll({ include: [{ model: Roles, as: 'role' }] });
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch users', details: err.message });
        }
    });

    // Get user by ID (admin only)
    router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const user = await Users.findByPk(req.params.id, { include: [{ model: Roles, as: 'role' }] });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch user', details: err.message });
        }
    });

    // Create user
    router.post('/users', async (req, res) => {
        try {
            const { username, password, email_address } = req.body;
            const user = await Users.create({ username, password, email_address });
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create user', details: err.message });
        }
    });

    // Update user (admin only)
    router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const user = await Users.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            const { username, password, email_address, roleId } = req.body;
            await user.update({ username, password, email_address, roleId });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update user', details: err.message });
        }
    });

    // Delete user (admin only)
    router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const user = await Users.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            await user.destroy();
            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete user', details: err.message });
        }
    });
};
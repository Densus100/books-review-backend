const { Roles } = require('../database/Sequelize').models;
const { authMiddleware, adminMiddleware } = require('../auth/middleware');

module.exports = (router) => {
    // List all roles (admin only)
    router.get('/roles', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const roles = await Roles.findAll();
            res.json(roles);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch roles', details: err.message });
        }
    });

    // Get role by ID (admin only)
    router.get('/roles/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const role = await Roles.findByPk(req.params.id);
            if (!role) return res.status(404).json({ error: 'Role not found' });
            res.json(role);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch role', details: err.message });
        }
    });

    // // Create role (admin only)
    // router.post('/roles', async (req, res) => {
    //     try {
    //         const { name, description, is_admin } = req.body;
    //         const role = await Roles.create({ name, description, is_admin });
    //         res.status(201).json(role);
    //     } catch (err) {
    //         res.status(500).json({ error: 'Failed to create role', details: err.message });
    //     }
    // });

    // Create role (admin only)
    router.post('/roles', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const { name, description, is_admin } = req.body;
            const role = await Roles.create({ name, description, is_admin });
            res.status(201).json(role);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create role', details: err.message });
        }
    });

    // Update role (admin only)
    router.put('/roles/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const role = await Roles.findByPk(req.params.id);
            if (!role) return res.status(404).json({ error: 'Role not found' });
            const { name, description, is_admin } = req.body;
            await role.update({ name, description, is_admin });
            res.json(role);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update role', details: err.message });
        }
    });

    // Delete role (admin only)
    router.delete('/roles/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const role = await Roles.findByPk(req.params.id);
            if (!role) return res.status(404).json({ error: 'Role not found' });
            await role.destroy();
            res.json({ message: 'Role deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete role', details: err.message });
        }
    });
};
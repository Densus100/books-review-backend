const { Favorites, Users, Books } = require('../database/Sequelize').models;
const { authMiddleware, adminMiddleware } = require('../auth/middleware');

module.exports = (router) => {
    // List all favorites for the authenticated user
    router.get('/favorites', authMiddleware, async (req, res) => {
        try {
            const favorites = await Favorites.findAll({
                where: { userId: req.user.id },
                include: [{ model: Books, as: 'book' }]
            });
            res.json(favorites);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch favorites', details: err.message });
        }
    });

    // List all favorites for all users (admin only)
    router.get('/admin/favorites', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const favorites = await Favorites.findAll({
                include: [
                    { model: Books, as: 'book' },
                    { model: Users, as: 'user', attributes: ['id', 'username', 'email_address'] }
                ]
            });
            res.json(favorites);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch all favorites', details: err.message });
        }
    });

    // Add a book to favorites (authenticated user)
    router.post('/favorites', authMiddleware, async (req, res) => {
        try {
            const { bookId } = req.body;
            if (!bookId) return res.status(400).json({ error: 'bookId is required' });

            // Prevent duplicate favorites
            const exists = await Favorites.findOne({ where: { userId: req.user.id, bookId } });
            if (exists) return res.status(409).json({ error: 'Book already in favorites' });

            const favorite = await Favorites.create({ userId: req.user.id, bookId });
            res.status(201).json(favorite);
        } catch (err) {
            res.status(500).json({ error: 'Failed to add favorite', details: err.message });
        }
    });

    // Remove a book from favorites (authenticated user)
    router.delete('/favorites/:bookId', authMiddleware, async (req, res) => {
        try {
            const { bookId } = req.params;
            const favorite = await Favorites.findOne({ where: { userId: req.user.id, bookId } });
            if (!favorite) return res.status(404).json({ error: 'Favorite not found' });

            await favorite.destroy();
            res.json({ message: 'Favorite removed' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to remove favorite', details: err.message });
        }
    });

    // // Get a specific favorite by bookId (authenticated user)
    // router.get('/favorites/:bookId', authMiddleware, async (req, res) => {
    //     try {
    //         const { bookId } = req.params;
    //         const favorite = await Favorites.findOne({
    //             where: { userId: req.user.id, bookId },
    //             include: [{ model: Books, as: 'book' }]
    //         });
    //         if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
    //         res.json(favorite);
    //     } catch (err) {
    //         res.status(500).json({ error: 'Failed to fetch favorite', details: err.message });
    //     }
    // });

    // Get all favorites for a specific book (admin only)
    router.get('/admin/favorites/book/:bookId', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const { bookId } = req.params;
            const favorites = await Favorites.findAll({
                where: { bookId },
                include: [
                    { model: Users, as: 'user', attributes: ['id', 'username', 'email_address'] },
                    { model: Books, as: 'book' }
                ]
            });
            res.json(favorites);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch favorites by book', details: err.message });
        }
    });
};
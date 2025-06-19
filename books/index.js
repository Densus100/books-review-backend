const { Books, Reviews, Users } = require('../database/Sequelize').models;
const { authMiddleware, adminMiddleware } = require('../auth/middleware');

module.exports = (router) => {
    // List all active books (public)
    router.get('/books', async (req, res) => {
        try {
            const books = await Books.findAll({ where: { is_active: true } });
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch books', details: err.message });
        }
    });

    // Get book by ID (public, only if active)
    router.get('/books/:id', async (req, res) => {
        try {
            const book = await Books.findOne({ where: { id: req.params.id, is_active: true } });
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch book', details: err.message });
        }
    });

    // List all books (admin only, all statuses)
    router.get('/admin/books', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const books = await Books.findAll();
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch all books', details: err.message });
        }
    });

    // Get book by ID (admin only, any status)
    router.get('/admin/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const book = await Books.findByPk(req.params.id);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch book', details: err.message });
        }
    });

    // Create book (admin only)
    router.post('/books', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const { name, description, image_path, release_date, is_active } = req.body;
            const book = await Books.create({ name, description, image_path, release_date, is_active });
            res.status(201).json(book);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create book', details: err.message });
        }
    });

    // Update book (admin only)
    router.put('/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const book = await Books.findByPk(req.params.id);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            const { name, description, image_path, release_date, is_active } = req.body;
            await book.update({ name, description, image_path, release_date, is_active });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update book', details: err.message });
        }
    });

    // Delete book (admin only)
    router.delete('/books/:id', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const book = await Books.findByPk(req.params.id);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            await book.destroy();
            res.json({ message: 'Book deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete book', details: err.message });
        }
    });

        // Get all reviews for a specific book (public)
    router.get('/books/:bookId/reviews', async (req, res) => {
        try {
            const reviews = await Reviews.findAll({
                where: { bookId: req.params.bookId },
                include: [
                    { model: Users, as: 'user', attributes: ['id', 'username'] },
                    { model: Books, as: 'book', attributes: ['id', 'name'] }
                ]
            });
            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch reviews for book', details: err.message });
        }
    });
};
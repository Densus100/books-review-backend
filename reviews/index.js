const { Reviews, Users, Books } = require('../database/Sequelize').models;
const { authMiddleware } = require('../auth/middleware');

module.exports = (router) => {
    // List all reviews (public)
    router.get('/reviews', async (req, res) => {
        try {
            const reviews = await Reviews.findAll({
                include: [
                    { model: Users, as: 'user', attributes: ['id', 'username'] },
                    { model: Books, as: 'book', attributes: ['id', 'name'] }
                ]
            });
            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
        }
    });

    // Get review by ID (public)
    router.get('/reviews/:id', async (req, res) => {
        try {
            const review = await Reviews.findByPk(req.params.id, {
                include: [
                    { model: Users, as: 'user', attributes: ['id', 'username'] },
                    { model: Books, as: 'book', attributes: ['id', 'name'] }
                ]
            });
            if (!review) return res.status(404).json({ error: 'Review not found' });
            res.json(review);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch review', details: err.message });
        }
    });

    // Create review (authenticated user only)
    router.post('/reviews', authMiddleware, async (req, res) => {
        try {
            const { rating, comment, bookId } = req.body;
            if (!rating || !comment || !bookId) {
                return res.status(400).json({ error: 'rating, comment, and bookId are required' });
            }
            if (Number(rating) > 5) {
                return res.status(400).json({ error: 'rating must be 5 or less' });
            }
            if (Number(rating) <= 0) {
                return res.status(400).json({ error: 'rating must be greater than 0' });
            }
            const review = await Reviews.create({
                rating,
                comment,
                bookId,
                userId: req.user.id
            });
            res.status(201).json(review);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create review', details: err.message });
        }
    });

    // Update review (only by owner)
    router.put('/reviews/:id', authMiddleware, async (req, res) => {
        try {
            const review = await Reviews.findByPk(req.params.id);
            if (!review) return res.status(404).json({ error: 'Review not found' });
            if (review.userId !== req.user.id) {
                return res.status(403).json({ error: 'You can only update your own reviews' });
            }
            const { rating, comment, active } = req.body;
            if (rating !== undefined && Number(rating) > 5) {
                return res.status(400).json({ error: 'rating must be 5 or less' });
            }
            if (rating !== undefined && Number(rating) <= 0) {
                return res.status(400).json({ error: 'rating must be greater than 0' });
            }
            await review.update({ rating, comment, active });
            res.json(review);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update review', details: err.message });
        }
    });

    // Delete review (only by owner)
    router.delete('/reviews/:id', authMiddleware, async (req, res) => {
        try {
            const review = await Reviews.findByPk(req.params.id);
            if (!review) return res.status(404).json({ error: 'Review not found' });
            if (review.userId !== req.user.id) {
                return res.status(403).json({ error: 'You can only delete your own reviews' });
            }
            await review.destroy();
            res.json({ message: 'Review deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete review', details: err.message });
        }
    });
};
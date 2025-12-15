const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public (or Private depending on needs, currently Public for simplicity)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

// POST create comment
router.post('/create/:id', commentController.createComment_post);

module.exports = router;

const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// GET post page
router.get('/:id', postController.postPage_get);

// POST create post
router.post('/', postController.createPost_post);

// POST delete post
router.post('/delete/:id', postController.deletePost_post);

module.exports = router;

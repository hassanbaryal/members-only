const express = require('express');
const postCrontroller = require('../controllers/postController');

const router = express.Router();

// POST create post
router.post('/', postCrontroller.createPost_post);

// POST delete post
router.post('/delete/:id', postCrontroller.deletePost_post);

module.exports = router;

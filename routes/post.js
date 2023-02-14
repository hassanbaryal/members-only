const express = require('express');
const postCrontroller = require('../controllers/postController');

const router = express.Router();

router.post('/', postCrontroller.createPost_post);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getById, getUserBlogs, postBlog, search, searchAuthor, edit, deleteBlog } = require('../controllers/blog');
const { ownsBlog, ownsBlogs } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

router.use(cors());


router.get('/', ownsBlogs, async (req, res, next) => {
    console.log(req.user);
    try {
        const blogs = await getUserBlogs(req.user.blogs);
        res.json(blogs);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', ownsBlog, async (req, res, next) => {
    const { id } = req.params;
    try {
        const blog = await getById(id);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

router.get('/search/author/:key', async (req, res, next) => {
    const { key } = req.params;
    try {
        const blog = await searchAuthor(key);
        if (!blog.length) throw new Error('No match');
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

router.get('/search/:key', async (req, res, next) => {
    const { key } = req.params;
    try {
        const blog = await search(key);
        if (!blog.length) throw new Error('No match');
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    let { body, user: { id } } = req;
    try {
        const blog = await postBlog({ ...body, author: id });
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

router.patch('/:id', ownsBlog, async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const editedBlog = await edit(id, body);
        res.json({ message: "Blog edited!", edit: editedBlog });
    } catch (e) {
        next(e);
    }
})

router.delete('/:id', ownsBlog, async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const deletedBlog = await deleteBlog(id, user);
        res.json({ message: "Blog Deleted!", deleted: deletedBlog });
    } catch (e) {
        next(e);
    }
})

module.exports = router;
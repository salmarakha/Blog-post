const express = require('express');
const router = express.Router();
const { addComment } = require('../controllers/comment');
const cors = require('cors');

router.use(cors());

// router.get('/:blogId', (req, res, next) => {
//     const { blogId } = req.params;
//     console.log(blogId);
//     try {
//         const comments = getComments(blogId);
//         res.json(comments);
//     } catch (e) {
//         next(e);
//     }
// });

router.post('/:blogId/comment', async (req, res, next) => {
    // console.log(req.params);
    // console.log(req.user);
    // console.log(req.body);
    const userId = req.user._id;
    const content = req.body;
    const { blogId } = req.params;
    console.log(blogId);
    try {
        const comment = await addComment({...content, author: userId, blogId: Number(blogId)});
        console.log(comment);
        res.json({message: "Comment Added!", comment: comment});
    } catch (e) {
        next(e);
    }
})


module.exports = router;

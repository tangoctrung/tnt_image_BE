const router = require('express').Router();
const Follow = require('./followRouter');
const Post = require('./postRouter');
const verifyToken = require('../middleware/auth');

// CREATE A POST
router.post('/createpost', verifyToken, async (req, res) => {
    try {
        const {authorId, title, body, images, themen} = req.body;
        const newPost = new Post({authorId, body, images, themen});
        try {
            const savedPost = await newPost.save();
            res.status(200).json({success: true, message: "Bài viết được tạo thành công", data: {savedPost}});
        } catch (err) {
            res.status(500).json(err);
        }
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// EDIT A POST
router.put('/editpost/:postId', verifyToken, async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// DELETE A POST
router.delete('/deletepost/:postId', verifyToken, async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// GET A POST
router.get('/getpost/:postId', verifyToken, async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// GET ALL POST OF A USER
router.get('/getpost/:userId', verifyToken, async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// GET ALL POST OF A THEMEN
router.get('/getpostthemen', verifyToken, async (req, res) => {
    const themen = req.query.themen;
    try {

    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// GET ALL POST OF USERS FOLLOWING
router.get('/getpostfollowing', verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        const users = await Follow.find({follower: userId});
        const userPosts = await Post.find({ authorId: userId }).populate('authorId', ['id', 'username', 'avatar']);          
        const friendPosts = await Promise.all(
            users.map((user) => {
                return Post.find({ authorId: user.isfollower }).populate('authorId', ['id', 'username', 'avatar']);
            })
        );
        const listPost = userPosts.concat(...friendPosts);
        return res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {listPost}});
        
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// LIKE/DISLIKE POST
router.put("/post/:id/like", verifyToken, async (req, res) => {
    const userId = req.userId; 
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });
        res.status(200).json({success: false, message: "Bài viết đã được like", data: {}});
      } else {
        await post.updateOne({ $pull: { likes: userId } });
        res.status(200).json({success: false, message: "Đã bỏ like bài viết", data: {}});
      }
    } catch (err) {
      res.status(500).json(err);
    }
});


module.exports = router;
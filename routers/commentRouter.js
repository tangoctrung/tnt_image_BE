const router = require('express').Router();
const Comment = require('../models/commentModel');
const verifyToken = require('../middleware/auth');

// CREATE A COMMENT
router.post('/createComment/', verifyToken, async (req, res) => {
    try {
        const writerId = req.userId;
        const {postId, content} = req.body;
        const newComment = new Comment({writerId, postId, content});
        const savedComment = await newComment.save();
        res.status(200).json({success: true, message: 'Tạo thành công', data: {savedComment}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// EDIT A COMMENT
router.put('/editComment/:commentId', verifyToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findByIdAndUpdate({_id: commentId}, { $set: req.body }, {new: true})
            .populate('writerId', ['id', 'username', 'avatar']);  
        res.status(200).json({success: true, message: 'Chỉnh sửa thành công', data: {comment}});  
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// DELETE A COMMENT
router.put('/deleteComment/:commentId', verifyToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findByIdAndUpdate({_id: commentId}, { isDelete: true }, {new: true})
            .populate('writerId', ['id', 'username', 'avatar']);  
        res.status(200).json({success: true, message: 'Xóa thành công', data: {comment}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// GET A COMMENT
router.get('/getComment/:commentId', verifyToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById({_id: commentId})
            .populate('writerId', ['id', 'username', 'avatar']);  
        res.status(200).json({success: true, message: 'Lấy thành công', data: {comment}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// GET ALL COMMENT
router.get('/getallComment/:postId', verifyToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({postId: postId})
            .populate('writerId', ['id', 'username', 'avatar']);  
        res.status(200).json({success: true, message: 'Lấy thành công', data: {comments}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// LIKE A COMMENT
router.put('/likeComment/:commentId', verifyToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if (!comment.likes.includes(req.userId)) {
          await comment.updateOne({ $push: { likes: req.userId } });
          res.status(200).json({success: true, message: 'Like thành công', data: {comment}});
        } else {
          await comment.updateOne({ $pull: { likes: req.userId } });
          res.status(200).json({success: true, message: 'Dislike thành công', data: {comment}});
        }
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});


module.exports = router;
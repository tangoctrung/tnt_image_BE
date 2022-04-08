const router = require('express').Router();
const Conversation = require('../models/conversationModel');
const verifyToken = require('../middleware/auth');

// CREATE A CONVERSATION
router.post('/createConversation', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const firstUserId = req.body.firstUserId;
        const newConversation = new Conversation({
            members1: userId,
            members2: firstUserId,
        });
        const savedConversation = await newConversation.save();
        res.status(200).json({success: true, message: 'Tạo thành công', data: {savedConversation}});
        
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// GET CONVERSATIONS OF USER 
router.get('/getConversation', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const conversations = await Conversation.find({$or: [{members1: userId}, {members2: userId}]})
            .populate('members1', ['id', 'username', 'avatar'])
            .populate('members2', ['id', 'username', 'avatar']);
        res.status(200).json({success: true, message: 'Lấy thành công', data: {conversations}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// GET CONVERSATION ID
router.get('/getConversation/:conversationId', verifyToken, async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversation = await Conversation.findById(conversationId);
        res.status(200).json({success: true, message: 'Lấy thành công', data: {conversation}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// LẤY CUỘC TRÒ CHUYỆN CỦA 2 NGƯỜI
// router.get("/getConversation/:firstUserId", async (req, res) => {
//     try {
//         const userId = req.userId;
//         const firstUserId = req.params.firstUserId;
//         const conversation = await Conversation.findOne({
//             $and: [{members1: userId}, {}]
//         });
//         if (conversation) {
//             res.status(200).json({success: true, message: 'Lấy thành công', data: {conversation}})
//         } else {
//             const newConversation = new Conversation({
//                 members: [userId, firstUserId],
//             });
//             try {
//                 const savedConversation = await newConversation.save();
//                 res.status(200).json({success: true, message: 'Tạo thành công', data: {savedConversation}});
//             } catch (err) {
//                 res.status(500).json({success: false, message: err.message, data: {}});
//             }
//         }
//     } catch (err) {
//         res.status(500).json({success: false, message: err.message, data: {}});
//     }
// });

// CẬP NHẬT TIN NHẮN CUỐI CỦA CUỘC TRÒ TRUYỆN
router.put('/updateConversation/:conversationId', async (req, res) => {
    try{
        const conversation = await Conversation.findByIdAndUpdate(req.params.conversationId, {
            $set: req.body
        }, {new: true});
        res.status(200).json({success: true, message: 'Cập nhật thành công', data: {conversation}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// CẬP NHẬT USER ĐÃ ĐỌC TIN NHẮN CUỐI CỦA CUỘC TRÒ TRUYỆN
router.put('/updateConversationRead/:conversationId', async (req, res) => {
    try{
        const conversation = await Conversation.findById(req.params.conversationId);
        const userRead = req.userId;
        if (!conversation.memberRead.includes(userRead)){
            await conversation.updateOne({ $push: { memberRead: userRead } });
            return res.status(200).json({success: true, message: 'Cập nhật thành công', data: {conversation}});
        }
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});


module.exports = router;
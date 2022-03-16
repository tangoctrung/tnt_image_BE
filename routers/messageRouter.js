const router = require("express").Router();
const Message = require("../models/messageModel");
const verifyToken = require("../middleware/auth");


// TẠO MỘT TIN NHẮN
router.post("/createMessage", verifyToken, async (req, res) => {  
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json({success: true, message: 'Tạo thành công', data: {savedMessage}});
    } catch (err) {
      res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// XÓA MỘT TIN NHẮN
router.put("/deleteMessage", verifyToken, async (req, res) => {
    try {
        const { messageId } = req.body;
        const savedMessage = await Message.findByIdAndUpdate({_id: messageId}, {isDelete: true}, {new: true});
        res.status(200).json({success: true, message: 'Xóa thành công', data: {savedMessage}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// LẤY TOÀN BỘ TIN NHẮN CỦA MỘT CUỘC TRÒ CHUYỆN
router.get("/getMessage/:conversationId", verifyToken, async (req, res) => {
  try {
      const conversationId = req.params.conversationId;
      const messages = await Message.find({
      conversationId: conversationId,
      });
      res.status(200).json({success: true, message: 'Lấy thành công', data: {messages}});
  } catch (err) {
      res.status(500).json({success: false, message: err.message, data: {}});
  }
});


module.exports = router;

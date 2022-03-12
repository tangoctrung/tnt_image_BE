const router = require("express").Router();
const User = require("../models/userModel");
const Follow = require("../models/followModel");
const verifyToken = require("../middleware/auth");

//GET FOLLOWERS
router.get("/followers", verifyToken, async (req, res) => {

    const userId = req.userId;
    try {
      const users = await Follow.find({isfollower: userId}).populate('isfollower', ['avatar', 'id', 'username']);
      if (users.length > 0) {
        res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
      } else {
        res.status(200).json({success: false, message: "Lấy dữ liệu không thành công", data: {}});
      }
    } catch (err) {
        res.json({success: false, message: err.message, data: {}});
    }
});
  
// GET FOLLOWINGS
router.get("/followings", verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        const users = await Follow.find({follower: userId}).populate('follower', ['avatar', 'id', 'username']);
        if (users.length > 0) {
          res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
        } else {
          res.status(200).json({success: false, message: "Lấy dữ liệu không thành công", data: {}});
        }
      } catch (err) {
          res.json({success: false, message: err.message, data: {}});
      }
});

//FOLLOW A USER
router.post("/follow/:userId", verifyToken, async (req, res) => {
    const followerId = req.userId;
    const isfollowerId = req.params.userId;
    try {
        const follow = await Follow.findOne({
            $and: [
                {follower: followerId}, 
                {isfollower: isfollowerId}
            ]
        });
        if (follow) {
            return res.status(403).json({success: true, message: "Bạn đã theo dõi người dùng này rồi", data: {}});
        } else {
            const newFollow = new Follow({
                follower: followerId,
                isfollower: isfollowerId
            });
            await newFollow.save();
            return res.status(403).json({success: true, message: "Đã theo dõi", data: {}});
        }
    } catch (err) {
        res.json({success: false, message: err.message, data: {}});
    }
    
});

// UNFOLLOWING A USER
router.delete("/unfollow/:userId", verifyToken, async (req, res) => {
    try {
        const followerId = req.userId;
        const isfollowerId = req.params.userId;
    
        const follow = await Follow.findOneAndRemove({
            $and: [
                {follower: followerId}, 
                {isfollower: isfollowerId}
            ]
        });
        if (follow) {
            return res.status(403).json({success: true, message: "Đã hủy theo dõi", data: {}});
        } else {      
            return res.status(403).json({success: true, message: "Không thể hủy theo dõi", data: {}});
        }
    } catch (err) {
        res.json({success: false, message: err.message, data: {}});
    }
    
});


module.exports = router;
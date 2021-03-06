const router = require("express").Router();
const User = require("../models/userModel");
const Follow = require("../models/followModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/auth");

// TÌM KIẾM NGƯỜI DÙNG THEO USERNAME OR EMAIL
router.get('/searchUser', verifyToken, async (req, res) => {
  const username = req.query.username;
  
  try {
      const users = await User.find({$text: {$search: username}});
      if (users.length == 0) {
        let users = [];
        let userArray = await User.find();
        userArray.map(user => {
             if (user.username.toLowerCase().includes(username.toLowerCase()) ||
                user.email.toLowerCase().includes(username.toLowerCase())) {
                 users.push(user);
             }
        })
        if (users.length == 0) {
          let users = await User.aggregate([{$sample: { size: 5 }}]);
          return res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
        }
        return res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
      }
      
      res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
  } catch (err) {
      res.status(500).json({success: false, message: err.message, data: {}});
  }
  
});

// GET A USER
router.get("/getUser/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const newUser = await User.findById(id);
    const follow = await Follow.findOne({
      $and: [
        {follower: req.userId}, 
        {isfollower: id}
      ]
    });
    let user;
    if (follow) {
      user = {...newUser._doc, isFollow: true};
    } else {
      user = {...newUser._doc, isFollow: false};
    }
    res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {user}});
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});

// GET ALL USER
router.get("/getAllUser", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});

// GET ALL USER NO FOLLOW
router.get("/getAllUserNoFollow", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    var listUser = [];
    const follow = await User.find();
    res.status(200).json({success: true, message: "Lấy dữ liệu thành công", data: {users}});
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});


// UPDATE INFO A USER
router.put("/updateUser", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByIdAndUpdate(
      {_id: userId},
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({success: true, message: "Cập nhật thông tin thành công", data: {user}});
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});

// ADD SEARCH HISTORY FOR USER
router.put("/addSearchHistory", verifyToken, async (req, res) => {
    try {
      const { history } = req.body;
      const currentUser = await User.findById(req.userId);   
      await currentUser.updateOne({ $push: { searchHistorys: history } }, {}, {new: true});
      res.status(200).json({success: true, message: "Thêm thành công", data: {historys: currentUser.searchHistorys}});   
    } catch (err) {
      res.status(500).json({success: false, message: err.message, data: {}});
    }
});

// DELETE SEARCH HISTORY FOR USER
router.put("/deleteSearchHistory", verifyToken, async (req, res) => {
  try {
    const { history } = req.body;
    const currentUser = await User.findById(req.userId);   
    await currentUser.updateOne({ $pull: { searchHistorys: history }},{}, {new: true});
    res.status(200).json({success: true, message: 'Thành công', data: {historys: currentUser.searchHistorys}});   
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});

// SAVE/UNSAVE POST
router.put("/savePost/", verifyToken, async (req, res) => {
  try {
    const { postId } = req.body;
    const user = await User.findById(req.userId);
    if (!user.postSaved.includes(postId)) {
      await user.updateOne({ $push: { postSaved: postId } });
      res.status(200).json({success: true, message: "Bài viết được lưu thành công", data: {}});
    } else {
      await user.updateOne({ $pull: { postSaved: postId } });
      res.status(200).json({success: true, message: "Bỏ lưu bài viết thành công", data: {}});
    }
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});

// GET ALL POST SAVED
router.get("/savePost", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const posts = await Promise.all(
      user.postSaved.map((postId) => {
        return Post.findById(postId).populate('authorId', ['id', 'username', 'avatar']);
      })
    );
    posts.sort((a, b) => a.score < b.score ? 1 : -1);  
    res.status(200).json({success: true, message: 'Thành công', data: {posts}});
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});

// CHANGE PASSWORD
router.put("/changePassword", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { passwordNew, confirmPasswordNew } = req.body;
    if (passwordNew !== confirmPasswordNew) {
      return res.status(400).json({success: false, message: 'Mật khẩu nhập lại không đúng', data: {}});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(passwordNew, salt);
    await User.findByIdAndUpdate({_id: userId}, {password: hashedPass}, {new: true});
    res.status(200).json({success: true, message: 'Đổi mật khẩu thành công', data: {}});
  } catch (err) {
    res.status(500).json({success: false, message: err.message, data: {}});
  }
});


module.exports = router;

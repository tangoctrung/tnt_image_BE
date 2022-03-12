const router = require("express").Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const verifyToken = require("../middleware/auth");

// TÌM KIẾM NGƯỜI DÙNG THEO USERNAME OR EMAIL
router.get('/getuser', verifyToken, async (req, res) => {
  const username = req.query.username;
  let userArray = [];
  try {
      const users = await User.find();
      users.map(user => {
           if (user.username.toLowerCase().includes(username.toLowerCase())) {
               userArray.push(user);
           }
      })
      res.status(200).json({success: false, message: "Lấy dữ liệu thành công", data: {userArray}});
  } catch (err) {
      res.status(500).json(err);
  }
  
})

// GET A USER
router.get("/profile/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).json({success: false, message: "Lấy dữ liệu thành công", data: {user}});
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL USER
router.get("/getalluser", verifyToken, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({success: false, message: "Lấy dữ liệu thành công", data: {user}});
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE INFO A USER
router.put("/profile/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({success: false, message: "Cập nhật thông tin thành công", data: {user}});
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD SEARCH HISTORY FOR USER
router.put("/addSearchHistory", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);   
        const history = await currentUser.updateOne({ $push: { searchHistorys: req.body.history } });
        res.status(200).json({success: true, message: "Thêm thành công", data: {history}});   
    } catch (err) {
      res.status(500).json(err);
    }
});

// DELETE SEARCH HISTORY FOR USER
router.put("/deleteSearchHistory", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);   
      const history = await currentUser.updateOne({ $pull: { searchHistorys: req.body.history } });
      res.status(200).json(history);   
  } catch (err) {
    res.status(500).json(err);
  }
});

// SAVE / UNSAVE POST
router.put("/savepost/", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user.postSaved.includes(req.body.postId)) {
      await user.updateOne({ $push: { postSaved: req.body.postId } });
      res.status(200).json("Bài viết đã được lưu thành công");
    } else {
      await user.updateOne({ $pull: { postSaved: req.body.postId } });
      res.status(200).json("Bỏ lưu bài viết thành công");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL POST SAVED
router.get("/savepost/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const posts = await Promise.all(
      user.postSaved.map((postId) => {
        return Post.findById(postId).populate('authorId', ['username', 'avatar']);
      })
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;

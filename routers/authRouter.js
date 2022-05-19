const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

// CREATE A USER / REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const user1 = await User.findOne({email: req.body.email});
        if (user1) 
            return res.status(400).json({success: false, message: "Email đã được sử dụng", data: {}})
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            // role: req.body.role,
        });
        const user = await newUser.save();
        res.status(200).json({success: true, message: "Đăng ký thành công", data: {user: user}});
    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const newUser = await User.findOne({email: req.body.email});
        if (!newUser) return res.status(400).json({success: false, message: "Sai email hoặc mật khẩu", data: {}});  
            
        const validate = await bcrypt.compare(req.body.password, newUser.password);
        if (!validate) return res.status(400).json({success: false, message: "Sai email hoặc mật khẩu", data: {}});          

        // tạo token
        const token = jwt.sign({_id: newUser._id, _role: newUser.role}, process.env.ACCESS_TOKEN_SECRET);
        const { password, ...others } = newUser._doc
        // res.header('auth-token', token);
        res.status(200).json({success: true, message: "Đăng nhập thành công", data: {newUser: {...others}, token}});

    } catch (err) {
        res.status(500).json({success: false, message: err.message, data: {}});
    }
})

// VERIFY USER
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user)
            return res.status(400).json('User not found')
        res.status(200).json({success: true, message: 'Lay thanh cong', data: {user}});
	} catch (err) {
		res.status(500).json({success: false, message: err.message, data: {}});
	}
});

// FORGET PASSWORD
router.put("/forgetPassword", async (req, res) => {
    try {
      const { email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      await User.findOneAndUpdate({email: email}, {password: hashedPass}, {new: true});
      res.status(200).json({success: true, message: 'Thành công', data: {}});
    } catch (err) {
      res.status(500).json({success: false, message: err.message, data: {}});
    }
  });

module.exports = router;
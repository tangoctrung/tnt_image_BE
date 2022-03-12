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
            return res.status(400).send({success: false, message: "Email đã được sử dụng", data: {}})
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            role: req.body.role,
        });
        const user = await newUser.save();
        res.status(200).json({success: true, message: "Đăng ký thành công", data: {user: user}});
    } catch (error) {
        res.status(500).json(error);
    }
})

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const newUser = await User.findOne({email: req.body.email});
        !newUser && res.status(400).json({success: false, message: "Sai email hoặc mật khẩu", data: {}});  
            
        const validate = await bcrypt.compare(req.body.password, newUser.password);
        !validate && res.status(400).json({success: false, message: "Sai email hoặc mật khẩu", data: {}});          

        // tạo token
        const token = jwt.sign({_id: newUser._id, _role: newUser.role}, process.env.ACCESS_TOKEN_SECRET);
        const { password, ...others } = newUser._doc
        // res.header('auth-token', token);
        res.status(200).json({success: true, message: "Đăng nhập thành công", data: {newUser: others, token: token}});

    } catch (error) {
        res.status(500).json(error);
    }
})

// VERIFY USER
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user)
            return res.status(400).json('User not found')
        res.status(200).json(user);
	} catch (error) {
		res.status(500).json('Internal server error')
	}
});

module.exports = router;
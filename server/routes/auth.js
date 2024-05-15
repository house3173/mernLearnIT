const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const verifyToken = require('../middleware/auth')


// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password')
		if (!user)
			return res.status(400).json({ success: false, message: 'User not found' })
		res.json({ success: true, user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/checkUser', async (req, res) => {
    const {username} = req.body
    try {
        const user = await User.findOne({username})

        if(user) 
            return res.status(400).json({success: false, message: 'Username already valid'})
        else {
            return res.status(200).json({success: true, message: 'Username is not exist'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Interval server error'});
        
    }
})

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    // Simple validation
    if(!username || !password) 
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password'})
    try {
        // Check for existing user
        const user = await User.findOne({username})

        if(user) 
            return res.status(400).json({success: false, message: 'Username already valid'})

        // All good
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({username, password: hashedPassword});
        
        await newUser.save()

        // Return token
        const accessToken = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json({success: true, message: 'User created sucessfully', accessToken});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Interval server error'});
    }
})


// @route POST api/auth/Login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    // Simple validation
    if(!username || !password) 
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password'})
    try {
        // Check for existing user
        const user = await User.findOne({username})

        if(!user) 
            return res.status(400).json({success: false, message: 'Incorrect username or password!'});

        // Usernaem found
        const passwordValid = await argon2.verify(user.password, password);
        if(!passwordValid) 
            return res.status(400).json({success: false, message: 'Incorrect username or password!'});

        // All good
        // Return token
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json({success: true, message: 'Loggin sucessfully', accessToken});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Interval server error'});
    }
})


router.get('/', (req,res) => res.send('USER ROUTE'));

module.exports = router
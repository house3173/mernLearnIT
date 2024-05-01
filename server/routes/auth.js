const express = require('express');
const router = express.Router();

const User = require('../models/User');

// @route POST api/auth/register
// @desc Register user
// @access Public
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
    } catch (error) {
        
    }
})

router.get('/', (req,res) => res.send('USER ROUTE'));

module.exports = router
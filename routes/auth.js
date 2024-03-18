const express = require('express')
const router = express.Router();
const User = require("../modals/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const fetchuser = require('../middleware/fetchuser')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'ThisistavanamRAMA@352'

router.post('/login', [      // =>/api/auth/login
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password is cannot be empty').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;  // this is the entered data
    try {
        let success = true
        let user = await User.findOne({ email })
        if (!user) {
            success = false
            return res.status(400).json({ success, error: "user does not exist" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "password does not matches" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

router.post('/createuser', [   // =>/api/auth/createuser
    body('name', 'Enter valid name').isLength({ min: 5 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    let success = true;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success: success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            success = false
            return res.status(400).json({ success: success, error: "sorry user with this email is already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({ //create a new user
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

router.post('/getuser', fetchuser, async (req, res) => {   // => /api/auth/getuser
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router
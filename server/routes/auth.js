const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const requireLogin = require('../middleware/requireLogin')


router.use(express.urlencoded({ extended: true }));


router.post('/signup',
    (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(422).json({
                error: "please fill all the fields"
            })
        }
        User.findOne({ email: email })
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({ error: "user already exists with that email" })
                }
                bcrypt.hash(password, 12)
                    .then(hashedpassword => {
                        const user = new User({
                            email,
                            password: hashedpassword,
                            name
                        })
                        user.save()
                            .then(user => {
                                res.json({ message: "saved successfully" })
                            })
                            .catch(err => console.log(err))
                    })
            })
            .catch(err => console.log(err))
    })

router.post('/signin',
    (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ error: "please enter both email and password" })
        }
        User.findOne({ email: email })
            .then(savedUser => {
                if (!savedUser) {
                    return res.status(422).json({ error: "Incorrect email or password" })
                }
                bcrypt.compare(password, savedUser.password)
                    .then(doMatch => {
                        if (!doMatch) {
                            return res.status(422).json({ error: "Incorrect email or password" })
                        }
                        //res.json({ message: "successfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        res.json({
                            message: "signed in",
                            token
                        })
                    }).catch(err => console.log(err))
            })
    })


module.exports = router
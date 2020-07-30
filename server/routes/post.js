const express = require('express')
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const Post = mongoose.model("Post")

router.get('/allposts',
    (req, res) => {

        Post.find()
            .populate("postedBy", "_id name")
            .then(post => { res.json({ post: post }) })
            .catch(err => console.log(err))

    })

router.get('/myposts', requireLogin,
    (req, res) => {
        Post.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name")
            .then(mypost => {
                res.json({ mypost })
                    .catch(err => console.log(err))
            })
    })

router.post('/createpost', requireLogin,
    (req, res) => {
        const { title, body } = req.body
        if (!title || !body) {
            return res.status(422).json({ error: "No title or body" })
        }
        req.user.password = undefined
        console.log(req.user)
        const post = new Post({
            title,
            body,
            postedBy: req.user
        })
        post.save()
            .then(result => { res.json({ post: result }) })
            .catch(console.log(err => err))
    })

module.exports = router
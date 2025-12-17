const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Notification = require("../models/Notification"); // Import Notification model
const auth = require("../middleware/authMiddleware");
const { validatePost } = require("../middleware/validationMiddleware");

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name username email avatarSeed role") // Include role
            .populate("comments.user", "name username email avatarSeed role") // Include role
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", [auth, validatePost], async (req, res) => {
    try {
        const { title, content, category } = req.body;

        const newPost = new Post({
            user: req.user.id,
            title,
            content,
            category,
        });

        const post = await newPost.save();
        const populatedPost = await Post.findById(post._id).populate("user", "name username email avatarSeed role");
        res.json(populatedPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put("/:id", [auth, validatePost], async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Make sure user owns post (no admin override needed for simple edit usually, but can be added if requested)
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        post.title = title;
        post.content = content;
        post.category = category;

        await post.save();
        const populatedPost = await Post.findById(post._id).populate("user", "name username email avatarSeed role");
        res.json(populatedPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post("/:id/like", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "name username email avatarSeed role");

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Check if post is already liked
        const likeIndex = post.likes.indexOf(req.user.id);

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();

        // Re-populate comments users just in case
        await post.populate("comments.user", "name username email avatarSeed role");

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post("/:id/comment", auth, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        const newComment = {
            user: req.user.id,
            text,
        };

        post.comments.unshift(newComment);
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate("user", "name username email avatarSeed role")
            .populate("comments.user", "name username email avatarSeed role");

        res.json(populatedPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   PUT /api/posts/:id/comment/:commentId
// @desc    Update a comment
// @access  Private
router.put("/:id/comment/:commentId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Find comment
        const comment = post.comments.find(c => c.id === req.params.commentId);

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Check ownership
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        comment.text = req.body.text;

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate("user", "name username email avatarSeed role")
            .populate("comments.user", "name username email avatarSeed role");

        res.json(populatedPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// @route   DELETE /api/posts/:id/comment/:commentId
// @desc    Delete a comment
// @access  Private
router.delete("/:id/comment/:commentId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Find comment
        const comment = post.comments.find(c => c.id === req.params.commentId);

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Check ownership OR Admin
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: "Not authorized" });
        }

        // Admin Notification Logic
        if (req.user.role === 'admin' && comment.user.toString() !== req.user.id) {
            const notification = new Notification({
                user: comment.user, // The owner of the comment
                message: `Your comment on post "${post.title}" was deleted by an admin because it violated community guidelines.`,
                type: 'warning'
            });
            await notification.save();
        }

        // Remove comment
        const removeIndex = post.comments.map(c => c.id).indexOf(req.params.commentId);
        post.comments.splice(removeIndex, 1);

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate("user", "name username email avatarSeed role")
            .populate("comments.user", "name username email avatarSeed role");

        res.json(populatedPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Make sure user owns post OR is Admin
        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: "Not authorized" });
        }

        // Admin Notification Logic
        if (req.user.role === 'admin' && post.user.toString() !== req.user.id) {
            const notification = new Notification({
                user: post.user, // The owner of the post
                message: `Your post "${post.title}" was deleted by an admin because it violated community guidelines.`,
                type: 'warning'
            });
            await notification.save();
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ msg: "Post removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;

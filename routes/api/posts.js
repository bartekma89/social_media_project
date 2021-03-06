const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isEmpty, filter, includes } = require("lodash");
const validatePostInput = require("../../validation/post");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

const requiredAuth = passport.authenticate("jwt", { session: false });

// @route   GET /posts
// @desc    Show all posts
// @access  Public

router.get("/", async (req, res) => {
  const errors = {};
  try {
    const posts = await Post.find({})
      .sort({ date: "desc" })
      .exec();

    if (isEmpty(posts)) {
      errors.posts = "No posts, be first";
      return res.status(404).json({
        errors
      });
    }

    return res.status(200).json(posts);
  } catch (err) {
    errors.nopostsfound = "No posts found";
    return res.status(404).json(errors);
  }
});

// @route   GET /posts/:id
// @desc    Get post by ID
// @access  Public

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({
      nopostfound: "No post found"
    });
  }
});

// @route   DELETE /posts/:id
// @desc    Delete post by ID
// @access  Private

router.delete("/:id", requiredAuth, async (req, res) => {
  const errors = {};
  try {
    const post = await Post.findById(req.params.id).exec();

    if (post.user.toString() !== req.user.id) {
      errors.notauthorized = "User not authorized";
      return res.status(401).json(errors);
    }

    const postDeleted = await post.remove();

    return res.status(200).json({
      success: true,
      postDeleted
    });
  } catch (err) {
    errors.nopostfound = "No post found with that ID";
    return res.status(404).json(errors);
  }
});

// @route   POST /posts
// @desc    Create post
// @access  Private

router.post("/", requiredAuth, async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const newPost = await new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name
    }).save();

    return res.status(200).json(newPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   POST /posts/like/:id
// @desc    Like post by uniqe user
// @access  Private

router.post("/like/:id", requiredAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (
      filter(post.likes, like => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({
        alreadyliked: "User already liked this post"
      });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   POST /posts/dislike/:id
// @desc    Dislike post by uniqe user
// @access  Private

router.post("/dislike/:id", requiredAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (
      filter(post.likes, like => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        notliked: "You have not yet liked this post"
      });
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    console.log("err");
    return res.status(500).json(err);
  }
});

// @route   POST /posts/comment/:id
// @desc    Create comment
// @access  Private

router.post("/comment/:id", requiredAuth, async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const post = await Post.findById(req.params.id).exec();

    const newComment = {
      text: req.body.text,
      name: req.body.name,
      user: req.user.id
    };

    post.comments.unshift(newComment);

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({
      nopost: "Comment does not exist"
    });
  }
});

// @route   DELETE /posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private

router.delete("/comment/:id/:comment_id", requiredAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (
      filter(
        post.comments,
        comment => comment._id.toString() === req.params.comment_id
      ).length === 0
    ) {
      return res.status(404).json({ nocomment: "Comment does not exist" });
    }

    const removeIndex = post.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({
      nopost: "Post does not exist"
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const { isEmpty } = require("lodash");
const validationProfileInput = require("../../validation/profile");

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private

router.get("/", async (req, res) => {
  const errors = {};

  const profile = await Profile.findOne({ user: req.user.id });

  try {
    if (!profile) {
      errors.profile = "Profile this user does not exist";
      return res.status(404).json(errors);
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(404).json(err);
  }
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private

router.post("/", async (req, res, next) => {
  const profileFields = {};

  const { errors, isValid } = validationProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  profileFields.user = req.user.id;

  if (!isEmpty(req.body.handle)) {
    profileFields.handle = req.body.handle;
  }
  if (!isEmpty(req.body.company)) {
    profileFields.company = req.body.company;
  }
  if (!isEmpty(req.body.website)) {
    profileFields.website = req.body.website;
  }
  if (!isEmpty(req.body.location)) {
    profileFields.location = req.body.location;
  }
  if (!isEmpty(req.body.status)) {
    profileFields.status = req.body.status;
  }
  if (!isEmpty(req.body.skills)) {
    profileFields.skills = req.body.skills.split(",");
  }
  if (!isEmpty(req.body.bio)) {
    profileFields.bio = req.body.bio;
  }
  if (!isEmpty(req.body.githubusername)) {
    profileFields.githubusername = req.body.githubusername;
  }

  profileFields.social = {};
  if (!isEmpty(req.body.youtube)) {
    profileFields.social.youtube = req.body.youtube;
  }
  if (!isEmpty(req.body.twitter)) {
    profileFields.social.twitter = req.body.twitter;
  }
  if (!isEmpty(req.body.facebook)) {
    profileFields.social.facebook = req.body.facebook;
  }
  if (!isEmpty(req.body.linkedin)) {
    profileFields.social.linkedin = req.body.linkedin;
  }
  if (!isEmpty(req.body.instagram)) {
    profileFields.social.instagram = req.body.instagram;
  }

  console.log(profileFields);

  try {
    const profile = await Profile.findOne({ user: req.user.id }).exec();

    if (profile) {
      const profileUpdated = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.status(200).json(profileUpdated);
    } else {
      const profileByHandle = await Profile.findOne({
        handle: req.body.handle
      }).exec();

      if (profileByHandle) {
        errors.handle = "That handle already exists";

        return res.status(400).json(errors);
      }

      const newProfile = await new Profile(profileFields).save();

      return res.status(200).json(newProfile);
    }
  } catch (err) {
    res.status(500).json({ error: err });
    return next(err);
  }
});

module.exports = router;

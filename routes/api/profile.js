const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { isEmpty, isArray, isNil } = require('lodash');
const validationProfileInput = require('../../validation/profile');
const validationExperianceInput = require('../../validation/experience');
const validationEducationInput = require('../../validation/education');

const requiredAuth = passport.authenticate('jwt', { session: false });

// @route   GET /profile/me
// @desc    Get current users profile
// @access  Private

router.get('/me', requiredAuth, async (req, res) => {
  const errors = {};

  const profile = await Profile.findOne({ user: req.user.id });

  try {
    if (!profile) {
      errors.profile = 'Profile this user does not exist';
      return res.status(404).json(errors);
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ err });
  }
});

// @route   POST /profile
// @desc    Create or edit user profile
// @access  Private

router.post('/', requiredAuth, async (req, res) => {
  const profileFields = {};

  const { errors, isValid } = validationProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  profileFields.user = req.user.id;

  const {
    handle,
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername
  } = req.body;

  if (!isNil(handle)) {
    profileFields.handle = handle;
  }
  if (!isNil(company)) {
    profileFields.company = company;
  }
  if (!isNil(website)) {
    profileFields.website = website;
  }
  if (!isNil(location)) {
    profileFields.location = location;
  }
  if (!isNil(status)) {
    profileFields.status = status;
  }
  if (!isEmpty(skills)) {
    profileFields.skills = isArray(skills)
      ? skills.join().split(',')
      : skills.split(',');
  }
  if (!isNil(bio)) {
    profileFields.bio = bio;
  }
  if (!isNil(githubusername)) {
    profileFields.githubusername = githubusername;
  }

  profileFields.social = {};
  if (!isNil(req.body.youtube)) {
    profileFields.social.youtube = req.body.youtube;
  }
  if (!isNil(req.body.twitter)) {
    profileFields.social.twitter = req.body.twitter;
  }
  if (!isNil(req.body.facebook)) {
    profileFields.social.facebook = req.body.facebook;
  }
  if (!isNil(req.body.linkedin)) {
    profileFields.social.linkedin = req.body.linkedin;
  }
  if (!isNil(req.body.instagram)) {
    profileFields.social.instagram = req.body.instagram;
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id }).exec();

    if (profile) {
      const profileUpdated = await Profile.findOneAndUpdate(
        { user: req.user.id },
        profileFields,
        { new: true }
      );

      return res.status(200).json(profileUpdated);
    } else {
      const profileByHandle = await Profile.findOne({
        handle: req.body.handle
      }).exec();

      if (profileByHandle) {
        errors.handle = 'That handle already exists';

        return res.status(400).json(errors);
      }

      const newProfile = await new Profile(profileFields).save();

      return res.status(200).json(newProfile);
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
});

// @route   GET /profile/user/all
// @desc    Get profile by id
// @access  Public

router.get('/all', async (req, res) => {
  const errors = {};
  try {
    const profiles = await Profile.find({})
      .populate('user', ['email', 'name'])
      .exec();

    if (isEmpty(profiles)) {
      errors.profile = 'Profiles do not exist';
      return res.status(404).json(errors);
    }

    return res.status(200).json(profiles);
  } catch (err) {
    errors.profile = 'Profiles do not exist';
    return res.status(404).json(err);
  }
});

// @route   POST /profile/education
// @desc    Add education to profil
// @access  Private

router.post('/education', requiredAuth, async (req, res) => {
  const { errors, isValid } = validationEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id }).exec();

    if (!profile) {
      errors.profile = 'Profile this user does not exist';
      return res.status(400).json(errors);
    }

    const newEducation = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      description: req.body.description,
      current: req.body.current
    };

    profile.education.unshift(newEducation);

    const savedProfile = await profile.save();

    return res.status(200).json(savedProfile);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   POST /profile/experience
// @desc    Add expirience to profil
// @access  Private

router.post('/experience', requiredAuth, async (req, res) => {
  const { errors, isValid } = validationExperianceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id }).exec();

    if (!profile) {
      errors.profile = 'Profile this user does not exist';
      return res.status(400).json(errors);
    }

    const newExprerience = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      description: req.body.description,
      current: req.body.current
    };

    profile.experience.unshift(newExprerience);

    const savedProfile = await profile.save();

    return res.status(200).json(savedProfile);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   GET /profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      handle: req.params.handle
    })
      .populate('user', ['name', 'email'])
      .exec();

    if (!profile) {
      errors.profile = 'Profile this user does not exist';
      return res.status(404).json({ errors });
    }

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   GET /profile/user/:id
// @desc    Get profile by id
// @access  Public

router.get('/user/:id', async (req, res) => {
  let errors = {};
  try {
    const profile = await Profile.findOne({ user: req.params.id })
      .populate('user', ['email', 'name'])
      .exec();

    if (!profile) {
      errors.profile = 'Profile this user does not exist';
      return res.status(404).json(errors);
    }

    return res.status(200).json(profile);
  } catch (err) {
    errors.profile = 'Profile this user does not exist';
    return res.status(404).json(errors);
  }
});

// @route   DELETE /profile/user
// @desc    Delete current user
// @access  Private

router.delete('/user', requiredAuth, async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.user.id });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   DELETE /profile/experience/:exp_id
// @desc    Delete experience to profil
// @access  Private

router.delete('/experience/:exp_id', requiredAuth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    profile = await profile.save();

    return res.json(profile);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   DELETE /profile/education/:edu_id
// @desc    delete education to profil
// @access  Private

router.delete('/education/:edu_id', requiredAuth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).exec();

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    profile = await profile.save();

    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route   DELETE /profile/
// @desc    Delete profile and user
// @access  Private

router.delete('/', requiredAuth, async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });

    if (!profile) {
      errors.profile = 'Profile this user does not exist';
      return res.status(400).json(errors);
    }

    await User.findOneAndDelete({ _id: req.user.id });

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

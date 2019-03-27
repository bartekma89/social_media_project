const { isEmpty } = require("lodash");

const validateProfileInput = values => {
  let errors = {};
  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  if (isEmpty(values.handle)) {
    errors.handle = "Handle filed is required";
  } else if (values.handle.length <= 2 || values.handle.length > 40) {
    errors.handle = "Handle needs to between 2 and 40 characters";
  }

  if (isEmpty(values.status)) {
    errors.status = "Status filed is required";
  }

  if (isEmpty(values.skills)) {
    errors.skills = "Skills filed is required";
  }

  if (!isEmpty(values.website)) {
    if (!urlRegex.test(values.website)) {
      errors.website = "Not a valid url";
    }
  }

  if (!isEmpty(values.youtube)) {
    if (!urlRegex.test(values.youtube)) {
      errors.youtube = "Not a valid url";
    }
  }

  if (!isEmpty(values.twitter)) {
    if (!urlRegex.test(values.twitter)) {
      errors.twitter = "Not a valid url";
    }
  }

  if (!isEmpty(values.facebook)) {
    if (!urlRegex.test(values.facebook)) {
      errors.facebook = "Not a valid url";
    }
  }

  if (!isEmpty(values.linkedin)) {
    if (!urlRegex.test(values.linkedin)) {
      errors.linkedin = "Not a valid url";
    }
  }

  if (!isEmpty(values.instagram)) {
    if (!urlRegex.test(values.instagram)) {
      errors.instagram = "Not a valid url";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateProfileInput;

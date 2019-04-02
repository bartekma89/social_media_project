const { isEmpty } = require("lodash");

const validateExperienceInput = values => {
  let errors = {};

  if (isEmpty(values.title)) {
    errors.title = "Title field is required";
  }
  if (isEmpty(values.company)) {
    errors.company = "Company field is required";
  }
  if (isEmpty(values.from)) {
    errors.from = "From date filed is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateExperienceInput;

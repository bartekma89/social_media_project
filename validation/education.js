const { isEmpty } = require("lodash");

const validateEducationInput = values => {
  let errors = {};

  if (isEmpty(values.school)) {
    errors.school = "School field is required";
  }
  if (isEmpty(values.degree)) {
    errors.degree = "Degree field is required";
  }
  if (isEmpty(values.fieldofstudy)) {
    errors.fieldofstudy = "Field of study filed is required";
  }
  if (isEmpty(values.from)) {
    errors.from = "From filed is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateEducationInput;

const { isEmpty } = require("lodash");

const validatePostInput = values => {
  let errors = {};

  if (isEmpty(values.text)) {
    errors.text = "Text field is required";
  } else if (values.text.length < 5 || values.text.length > 60) {
    errors.text = "Text needs to between 5 and 60 charakters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validatePostInput;

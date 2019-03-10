const isEmpty = require("lodash").isEmpty;

const validateRegisterInput = values => {
  let errors = {};

  if (isEmpty(values.name)) {
    errors.name = "Name field is required";
  } else if (values.name.length <= 2 || values.name.length > 30) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (isEmpty(values.email)) {
    errors.email = "Email field is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Email is invalid";
  }

  if (isEmpty(values.password)) {
    errors.password = "Password filed is required";
  } else if (values.password.length < 6 || values.password.length > 30) {
    errors.password = "Password must be at least 6 characters";
  }

  if (isEmpty(values.passwordRepeat)) {
    errors.passwordRepeat = "Repeat password filed is required";
  }

  if (values.password !== values.passwordRepeat) {
    errors.passwordRepeat = "Password must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateRegisterInput;

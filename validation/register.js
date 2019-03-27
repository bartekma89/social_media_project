const { isEmpty } = require("lodash");

const validateRegisterInput = values => {
  let errors = {};
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;

  if (isEmpty(values.name)) {
    errors.name = "Name field is required";
  } else if (values.name.length <= 2 || values.name.length > 30) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (isEmpty(values.email)) {
    errors.email = "Email field is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Email is invalid";
  }

  if (isEmpty(values.password)) {
    errors.password = "Password filed is required";
  } else if (!passwordRegex.test(values.password)) {
    errors.password =
      "Password must have at least 6 characters, one number and one of the special character !@#$%^&*";
  } else if (values.password.length < 6) {
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

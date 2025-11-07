const validator = require("validator");

const dataValidator = (body) => {
  const { firstName, lastName, emailId, password } = body;

  if (!firstName || !lastName) {
    throw new Error("Enter proper name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter proper Email Id " + emailId);
  } else if (!validator.isStrongPassword(password, { minLength: 10 })) {
    throw new Error("Invalid Password: " + value);
  }
};

module.exports = {
  dataValidator,
};

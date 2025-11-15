const validator = require("validator");

const dataValidator = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw new Error("Enter proper name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter proper Email Id " + emailId);
  } else if (!validator.isStrongPassword(password, { minLength: 10 })) {
    throw new Error("Invalid Password: " + value);
  }
};

const updateBodyValidation = async (data) => {
  const editAllowedFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "skills",
    "photoUrl",
    "gender",
  ];

  const isEditAllowed = Object.keys(data).every((ele) =>
    editAllowedFields.includes(ele)
  );

  return isEditAllowed;
};

module.exports = {
  dataValidator,
  updateBodyValidation,
};

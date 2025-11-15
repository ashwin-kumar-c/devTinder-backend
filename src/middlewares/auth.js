const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedData = jwt.verify(token, "DevTinder@081125");
    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User dosen't exist");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = {
  userAuth,
};

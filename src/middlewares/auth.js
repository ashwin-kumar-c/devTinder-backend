const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
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

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/Users");
const { dataValidator } = require("../Utils/Validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    // Data Validation
    dataValidator(req.body);

    // Encrypt Password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding User:" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(400).send("Invalid Credentials");
    }
    const isLoginValid = user.validatePassword(password);

    if (isLoginValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("User Logged in successfully");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in the user");
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("User Logged Out Successfully");
  } catch (err) {
    res.status(400).send("Error logging out the user");
  }
});

module.exports = authRouter;

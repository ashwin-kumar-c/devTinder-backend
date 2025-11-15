const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../Models/Users");
const { userAuth } = require("../Middlewares/Auth");
const { updateBodyValidation } = require("../Utils/Validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const user = req.user;
  try {
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching Profile:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = updateBodyValidation(req.body);

    if (!isEditAllowed) {
      throw new Error("Invalid Edit request");
    }
    const existingProfileData = req.user;
    const incomingData = req.body;

    Object.keys(incomingData).forEach(
      (key) => (existingProfileData[key] = incomingData[key])
    );

    await existingProfileData.save();
    res.send(`${req.user.firstName}, your data has updated successfully`);
  } catch (err) {
    res.status(400).send("Error updating profile");
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const password = req.body.newPassword;
    const user = req.user;

    if (!validator.isStrongPassword(password, { minLength: 10 })) {
      throw new Error("Invalid Password: " + password);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user["password"] = passwordHash;

    user.save();
    res.send("password changed Successfully");
  } catch (err) {
    res.status(400).send("Error updating Password");
  }
});

module.exports = profileRouter;

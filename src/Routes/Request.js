const express = require("express");
const { userAuth } = require("../Middlewares/Auth");

const requestRouter = express.Router();

requestRouter.post("/request", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user.firstName + " Sent the Request");
  } catch (err) {
    res.status(400).send("Error sending connection request:" + err.message);
  }
});

module.exports = requestRouter;

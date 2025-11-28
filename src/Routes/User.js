const express = require("express");
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUsedId = req.user._id;

    const getAllRequests = await ConnectionRequest.find({
      toUserId: loggedInUsedId,
      status: "interested",
    }).populate("fromUserId", "firstName lastName about photoUrl skills");
    // .populate("fromUserId", ["firstName", "lastName"])
    res.send({
      message: "Fetched all the requests",
      data: getAllRequests,
    });
  } catch (err) {
    return res.status(400).send("Error fetching Requests");
  }
});

module.exports = userRouter;

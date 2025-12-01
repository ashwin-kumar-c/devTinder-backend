const express = require("express");
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");
const User = require("../Models/Users");

const userRouter = express.Router();

const USER_DISPLAY_DATA = "firstName lastName about photoUrl skills"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const getAllRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DISPLAY_DATA);
    // .populate("fromUserId", ["firstName", "lastName"])
    res.send({
      message: "Fetched all the requests",
      data: getAllRequests,
    });
  } catch (err) {
    return res.status(400).send("Error fetching Requests");
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", USER_DISPLAY_DATA)
      .populate("toUserId", USER_DISPLAY_DATA);

    const modifiedConnections = connections.map((ele) => {
      if (ele.fromUserId._id.toString() === loggedInUser._id.toString()) {
        // convert ObjectId to string for comparision
        return ele.toUserId;
      }
      return ele.fromUserId;
    });

    res.send({
      message: "All Connections fetched",
      data: modifiedConnections,
    });
  } catch (err) {
    return res.status(400).send("Error fetching connections");
  }
});

/* 
  User should see all profiles, except
  his own profile,
  profile he has sent request(interested)
  profile he has ignored or got ignored
  profile he has rejected or got rejected
  profile he has accepted or get accepted
*/

userRouter.get("/user/feed", userAuth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((ele) => {
      hideUsersFromFeed.add(ele.fromUserId);
      hideUsersFromFeed.add(ele.toUserId);
    });

    const newUserFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],

      // _id: {
      //   $nin: Array.from(hideUsersFromFeed),
      //   $ne: loggedInUser._id
      // }
    })
      .select(USER_DISPLAY_DATA)
      .skip(skip)
      .limit(limit);

    res.send(newUserFeed);
  } catch (err) {
    return res.status(400).send("Error fetching users data");
  }
});

module.exports = userRouter;

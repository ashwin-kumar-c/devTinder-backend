const express = require("express");
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");

const userRouter = express.Router();

const USER_DISPLAY_DATA = "firstName lastName about photoUrl skills"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUsedId = req.user._id;

    const getAllRequests = await ConnectionRequest.find({
      toUserId: loggedInUsedId,
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
    const loggedInUsedId = req.user._id;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUsedId }, { toUserId: loggedInUsedId }],
    })
      .populate("fromUserId", USER_DISPLAY_DATA)
      .populate("toUserId", USER_DISPLAY_DATA);

    const modifiedConnections = connections.map((ele) => {
      if (ele.fromUserId._id.toString() === loggedInUsedId.toString()) {
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
    try {
        const loggedInUsedId = req.user._id

        const connectionReqs = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUsedId},
                {toUserId: loggedInUsedId}
            ],
            // status: {
            //     $nin: ["interested", "accepted", "rejected", "ignored"]
            // }
        })

        console.log(connectionReqs);
        

        res.send({
            message: "Feed for the user",
            data: connectionReqs
        })

    } catch (err) {
        return res.status(400).send("Error fetching users data");
    }
})

module.exports = userRouter;

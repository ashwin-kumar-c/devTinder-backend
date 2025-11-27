const express = require("express");
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");
const User = require("../Models/Users");

const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId
    const status = req.params.status

    const allowedStatus = ["interested", "ignored"]

    const isvalidStatus = allowedStatus.includes(status)
    if(!isvalidStatus) {
      return res.status(400).send("Invalid status type: " + status)
    }

    const checkToUser = await User.findById({_id: toUserId})

    if(!checkToUser) {
      return res.status(400).send("Invalid User Id")
    }

    const duplicateConnectionReq = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ]
    })

    if(duplicateConnectionReq) {
      return res.status(400).send("Connection Request already exists")
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    })

    const data = await connectionRequest.save()

    res.json({
      message: status==="interested" ?  `${req.user.firstName} is ${status} in ${checkToUser.firstName}` : `${req.user.firstName} has ${status} ${checkToUser.firstName}`,
      data: data
    })
  } catch (err) {
    return res.status(400).send("Error sending connection request:" + err.message);
  }
});

module.exports = requestRouter;

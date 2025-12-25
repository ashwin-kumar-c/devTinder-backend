const express = require("express");
const { userAuth } = require("../Middlewares/Auth");
const Chat = require("../Models/Chat");
const ConnectionRequest = require("../Models/ConnectionRequest");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const senderUserId = req.user._id;

  try {
    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: senderUserId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: senderUserId },
      ],
      status: "accepted",
    });

    if (!existingConnection) {
      throw new Error("Connection does not exist");
    }

    let chat = await Chat.findOne({
      participants: { $all: [senderUserId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderUserId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    return res.status(401).send("Error getting chat history");
  }
});

module.exports = chatRouter;

const socket = require("socket.io");
const crypto = require("crypto");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Chat = require("../Models/Chat");
const ConnectionRequest = require("../Models/ConnectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new socket.Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication token is missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Invalid or Expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join chat", ({ targetUserId }) => {
      const roomId = getSecretRoomId(socket.user._id, targetUserId);
      socket.join(roomId);
    });

    socket.on("send message", async ({ senderName, targetUserId, text }) => {
      try {
        const existingConnection = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: socket.user._id, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: socket.user._id },
          ],
          status: "accepted",
        });

        if (!existingConnection) {
          throw new Error("Connection does not exist");
        }

        const roomId = getSecretRoomId(socket.user._id, targetUserId);
        io.to(roomId).emit("message received", { senderName, text });

        let chat = await Chat.findOne({
          participants: { $all: [socket.user._id, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [socket.user._id, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: socket.user._id,
          text,
        });

        await chat.save();
      } catch (err) {}
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  });
};

module.exports = initializeSocket;

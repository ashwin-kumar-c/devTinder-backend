const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionRequestSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: "User", // ref to model not filename or schema name
    required: true,
  },

  toUserId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      message: `{Value} is invalid`,
    },
    required: true,
  },
});

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);

module.exports = ConnectionRequest;

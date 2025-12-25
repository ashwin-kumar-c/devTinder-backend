const express = require("express");
const connectDB = require("./Config/Database");
const cookieParser = require("cookie-parser")
const authRouter = require("./Routes/Auth")
const profileRouter = require("./Routes/Profile")
const requestRouter = require("./Routes/Request")
const userRouter = require("./Routes/User")
const chatRouter = require("./Routes/Chat");
const cors = require("cors")
const http = require("http")
const initializeSocket = require("./Utils/socket");

require('dotenv').config()

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB()
  .then(() => {
    console.log("Database Connection Established");
    server.listen(process.env.PORT, () => {
      console.log("Server is Successfully running on Port 4000");
    });
  })
  .catch(() => {
    console.log("Error Connecting to Database");
  });

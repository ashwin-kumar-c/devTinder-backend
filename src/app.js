const express = require("express");
const connectDB = require("./Config/Database");
const cookieParser = require("cookie-parser")
const authRouter = require("./Routes/Auth")
const profileRouter = require("./Routes/Profile")
const requestRouter = require("./Routes/Request")
const userRouter = require("./Routes/User")
const cors = require("cors")

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

connectDB()
  .then(() => {
    console.log("Database Connection Established");
    app.listen(4000, () => {
      console.log("Server is Successfully running on Port 4000");
    });
  })
  .catch(() => {
    console.log("Error Connecting to Database");
  });

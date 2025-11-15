const express = require("express");
const connectDB = require("./Config/Database");
const cookieParser = require("cookie-parser")
const authRouter = require("./Routes/Auth")
const profileRouter = require("./Routes/Profile")
const requestRouter = require("./Routes/Request")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter)

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

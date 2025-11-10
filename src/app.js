const express = require("express");
const connectDB = require("./Config/Database");
const { dataValidator } = require("./Utils/Validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const User = require("./Models/Users");
const { userAuth } = require("./Middlewares/Auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    // Data Validation
    dataValidator(req.body);

    // Encrypt Password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding User:" + err);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(400).send("Invalid Credentials");
    }
    const isLoginValid = user.validatePassword(password)

    if (isLoginValid) {
      const token = await user.getJWT()
      res.cookie("token", token, {expires: new Date(Date.now() +  8 * 3600000)})
      
      res.send("User Logged in successfully");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in the user");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const user = req.user
  try {
    res.send(user)
  } catch(err) {
    res.status(400).send("Error fetching Profile:" + err.message);
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {

  try {
    const {user} = req
    res.send(user.firstName + " Sent the Request")
  } catch(err) {
    res.status(400).send("Error sending connection request:" + err.message);
  }
})

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

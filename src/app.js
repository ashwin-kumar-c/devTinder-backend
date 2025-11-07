const express = require("express");
const connectDB = require("./Config/Database");
const { dataValidator } = require("./Utils/Validation");
const bcrypt = require("bcrypt");
const User = require("./Models/User");

const app = express();

app.use(express.json());

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
    const isLoginValid = await bcrypt.compare(password, user.password);

    if (isLoginValid) {
      res.send("User Logged in successfully");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in the user");
  }
});

// GET - All Users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching all users");
  }
});

// Get User based on condition

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.find({ emailId: email });

    if (user.length < 1) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user");
  }
});

//Get User by ID

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (user.length < 1) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user");
  }
});

// Delete User
app.delete("/user", async (req, res) => {
  const id = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(id);

    if (user.length < 1) {
      res.status(404).send("User not Deleted");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error deleting user");
  }
});

// Patch - Update user by id
app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;

  const RESTICTED_UPDATES = ["emailId", "password"];

  try {
    const updateNotAllowed = Object.keys(req.body).some((ele) =>
      RESTICTED_UPDATES.includes(ele)
    );
    if (updateNotAllowed) {
      throw new Error("Email or Password can't be changed");
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (user.length < 1) {
      res.status(404).send("User not Updated");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
  }
});

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

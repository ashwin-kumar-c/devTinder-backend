const express = require("express")
const { adminAuth, userAuth } = require("../middlewares/auth")

const app = express()

/* 
    How Express wroks
    Get /users ==> middleware chain ==> request handler
*/

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Internal server error")
    }
})

app.get("/getUserData", (req, res) => {
    try {
        throw new Error("Random Error")
        // res.send("User Data")
    } catch {
        res.status(500).send("Something went wrong")
    }
})

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Internal server error")
    }
})


app.listen(4000, () => {
    console.log("Server is Successfully running on Port 4000");
})
const express = require("express")

const app = express()

app.use("/home", (req, res) => {
    res.send("Welcome to website")
})

app.use("/about", (req, res) => {
    res.send("This is a service application")
})


app.listen(4000, () => {
    console.log("Server is Successfully running on Port 4000");
})
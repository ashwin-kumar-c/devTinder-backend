const express = require("express")

const app = express()

app.get(/.*fly$/, (req, res) => {
    res.send("RCCCCCCCCCCCCCBBBBBBBBBBB")
})

app.get("/user/:userId/:name/:number", (req, res) => {
    console.log(req.params, 'PPP');

    res.send({firstname: "Jon", lastName: "Doe"})
})

// app.get("/user", (req, res) => {
//     console.log(req.query, 'QQQ');

//     res.send({firstname: "Jon", lastName: "Doe"})
// })

app.post("/user", (req, res) => {
    // save the data to db
    res.send("Data saved successfully");
    
})

app.delete("/user", (req, res) => {
    res.send("Data deleted successfully");
    
})

app.use("/contact/22", (req, res) => {
    res.send("988776525")
})

app.use("/contact", (req, res) => {
    res.send("Thank you for contacting us")
})



app.use("/about", (req, res) => {
    res.send("This is a service application")
})

// app.use("/", (req, res) => {
//     res.send("Welcome to website")
// })

app.listen(4000, () => {
    console.log("Server is Successfully running on Port 4000");
})
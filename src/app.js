const express = require("express")
const { adminAuth, userAuth } = require("../middlewares/auth")

const app = express()

/* 
    How Express wroks
    Get /users ==> middleware chain ==> request handler
*/

app.get(/.*fly$/, (req, res) => {
    res.send("RCCCCCCCCCCCCCBBBBBBBBBBB")
})

// app.get("/user/:userId/:name/:number", (req, res) => {
//     console.log(req.params, 'PPP');
//     res.send({firstname: "Jon", lastName: "Doe"})
// })

// app.get("/user", (req, res) => {
//     console.log(req.query, 'QQQ');
//     res.send({firstname: "Jon", lastName: "Doe"})
// })

app.use("/admin", adminAuth) // This middleware only runs when part of url matches "/admin"

// app.use("/user", userAuth)

app.get("/user", userAuth, (req, res) => {
    res.send("User Data")
})

app.get("/admin/getAllData", (req, res) => {
    res.send("All Data sent")
})

app.delete("/admin/deleteData", (req, res) => {
    res.send("Data deleted")
})


app.listen(4000, () => {
    console.log("Server is Successfully running on Port 4000");
})
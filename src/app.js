const express = require("express")

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

// app.use("/uer", [rh1, rh2, rh3, rh4])

// Middleware
app.use("/",(req, res, next) => { 
    console.log("getting slash");
    // res.send("Response");
    next()
  }
);

// Route handler
app.get("/user", 
    (req, res, next) => {
    console.log("1st User handle");
    res.send("1st User Response")
}, (req, res, next) => {
    res.send("2nd User Response")
})



app.listen(4000, () => {
    console.log("Server is Successfully running on Port 4000");
})
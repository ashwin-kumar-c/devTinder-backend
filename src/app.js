const express = require("express")

const app = express()

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

app.use("/user",
  (req, res, next) => { // Route handler
    console.log("Handling the route User 1");
    // res.send("1st Response");
    // console.log("ZZZZZ");
    next()
  },
  [(req, res, next) => { // 2nd Route handler
    console.log("Handling the route User 2");
    // res.send("2nd Response");
    next()
  },
  (req, res, next) => { // 3nd Route handler
    console.log("Handling the route User 3");
    // res.send("3rd Response");
    next()
  }],
  (req, res, next) => { // 2nd Route handler
    console.log("Handling the route User 4");
    res.send("4th Response");
  }
);

app.listen(4000, () => {
    console.log("Server is Successfully running on Port 4000");
})
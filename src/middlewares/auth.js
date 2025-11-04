
const adminAuth = (req, res, next) => {
    const token = "xyz"
    const isAuthorized = (token === "xyz")
    if(!isAuthorized) {
        res.status(401).send("Unauthorized")
    }
    next()
    
}

const userAuth = (req, res, next) => {
    const token = "xyz"
    const isAuthorized = (token === "xyz")
    if(!isAuthorized) {
        res.status(401).send("Unauthorized")
    }
    next()
    console.log("AUTH RAN......");
    
}

module.exports = {
    adminAuth,
    userAuth
}
const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rootMongoUser:Oy0oUT8XV0LA39pb@cluster0.ik7uudx.mongodb.net/DevTinder")
}

module.exports = connectDB
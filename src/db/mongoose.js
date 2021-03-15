const mongoose = require("mongoose")

const connectionString = process.env.CONNECTION_STRING ||  "mongodb://172.21.32.1:27017/main_db"

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((value) => console.log("Connected to database"))
    .catch((error) => console.log("Error:", error))
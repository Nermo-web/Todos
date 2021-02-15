const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/main_db", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((value) => console.log("Connected to database"))
    .catch((error) => console.log("Error:", error))
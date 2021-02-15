const express = require("express")
const db = require('./db/mongoose');
const port = process.env.PORT || 3000
const app = express();

app.get("*", (req, res) => {
    res.status(404).send({
        error: "The request is not valid"
    })
})

app.listen(port, () => {
    console.log("Server is listening on port " + port)
})
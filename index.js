const express = require('express');

const app = express();


app.get('/', (req, res) => {
    res.send("hello, trungtn")
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
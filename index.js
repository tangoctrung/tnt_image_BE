const express = require('express');
const app = express();
const db = require('./db/index');
const dotenv = require('dotenv');
const cors = require('cors');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const followRouter = require('./routers/followRouter');

// config middleware
app.use(cors());
dotenv.config();
app.use(express.json());

// connect to db
db.connectDB();


// api
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", followRouter);



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
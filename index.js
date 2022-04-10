const express = require('express');
const app = express();
const db = require('./db/index');
const dotenv = require('dotenv');
const cors = require('cors');
const socketServer = require("./socketServer");
const http = require('http');


const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const followRouter = require('./routers/followRouter');
const commentRouter = require('./routers/commentRouter');
const conversationRouter = require('./routers/conversationRouter');
const messageRouter = require('./routers/messageRouter');
const postRouter = require('./routers/postRouter');

// config middleware
// app.use(cors());
dotenv.config();
app.use(express.json());

// connect to db
db.connectDB();

// connect to socketServer
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
    
    socketServer(socket);
});


// api
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", followRouter);
app.use("/api", commentRouter);
app.use("/api", conversationRouter);
app.use("/api", messageRouter);
app.use("/api", postRouter);




const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
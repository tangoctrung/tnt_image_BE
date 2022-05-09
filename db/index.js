const mongoose = require('mongoose');

// DB_URL_CLUSTER=mongodb+srv://trungtn:tnkg23072001@cluster0.d22zq.mongodb.net/tnt_image?retryWrites=true&w=majority
// DB_URL_LOCAL=mongodb://localhost/tnt_image

async function connectDB() {
    try {
        await mongoose
            .connect(process.env.DB_URL_LOCAL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        console.log("MongoDB is connected");
                
    } catch (err) {
        console.log(err);
    }
    
}

module.exports = {
    connectDB
};
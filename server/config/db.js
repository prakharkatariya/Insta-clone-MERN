const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });

        console.log(`MongoDB atlas connected:  ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting MongoDB:${error}`)
        process.exit(1);
    }
}

module.exports = connectDB;
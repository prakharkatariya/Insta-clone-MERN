const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const app = express()
const connectDB = require('./config/db')
require('./models/user')        //add db-schema of user
require('./models/post')        //add db-schema of a post


dotenv.config({ path: './config/config.env' });   //add .env file

connectDB();  //fn for connecting to mongodb

//middlewares
app.use(express.json())
app.use(require('./routes/auth'))   //add routes
app.use(require('./routes/post'))


app.get("/", (req, res) => res.send("Hello World"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running at ${PORT}`))
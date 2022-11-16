const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();

//Port
const PORT = process.env.PORT || 8000;
const URL = process.env.MONGODB_URL;

app.use(cors());
app.use(bodyParser.json());

// Parsers for POST data
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));


//Routes
const userRouter = require("./routes/users.js");
app.use("/user", userRouter);

const fileRouter = require("./controllers/fileController.js");
app.use("/upload", fileRouter);


//Connect
mongoose.connect(URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    }, err => {
        if(err) throw err;
        console.log('Connected to MongoDB!!!')
});

const connection = mongoose.connection;

//Connect once
connection.once("open", () => {
    console.log("Mongo DB Connection Successful!")
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

const posts = [
    {
        username: 'shalitha',
        title: 'Post 1'
    },
    {
        username: 'Jane',
        title: 'Post 2'
    }
];

app.get('/posts',authenticateToken,(req, res) => {
    res.send(posts);
})


function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

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

const messageRouter = require("./routes/messages.js");
app.use("/message",messageRouter);


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


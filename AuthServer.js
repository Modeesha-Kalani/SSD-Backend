const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
let user = require("./models/user.js");



app.use(cors());
// Parsers for POST data
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

//URL
const URL = process.env.MONGODB_URL;
//Port
const PORT = process.env.PORT2 || 9000;

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

let refreshTokens = [];

//login
app.post('/login', (req, res) => {
    //authenticate user
    
    const username = req.body.email;
    const password = req.body.password;

    try{
        user.findOne
    ({email:username}, (err, user) => {
        if(err) throw err;
        if(!user){
            res.json({message: "User not found please check email", status:false});
        }
        else{
            console.log("user", user);
            //compare password
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) throw err;
                if(result){
                    //user
                    const user1 = { 
                        name: user.name,
                        email: username,
                        type: user.type
                     };
                    //create access token
                    const accessToken = jwt.sign({user1}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '200s'});
                    const refreshToken = jwt.sign({user1}, process.env.REFRESH_TOKEN_SECRET);
                    refreshTokens.push(refreshToken);
                    res.json({status:true,accessToken: accessToken, refreshToken: refreshToken});
                }
                else{
                    res.json({message: "Password is incorrect", status:false});
                }
            })
        }
    })
    }catch(err){
        console.log(err);
        //send error
        res.status(500).send(err);
    }
    //get user from db
    

    // //Hash password
    // const salt = bcrypt.genSaltSync(10);
    // const hashed_password = bcrypt.hashSync(password, salt);

    // console.log(username, ' ', password , ' ', hashed_password);
    // const user = { name: username };

    // const accessToken = generateAccessToken(user);
    // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    // refreshTokens.push(refreshToken);
    // res.json({ accessToken: accessToken , refreshToken: refreshToken });
    
})

//logout
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
}) 

//create refresh token
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    console.log("refreshToken: " + refreshToken);
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    })
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
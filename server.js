const express = require('express');
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
    res.send(posts.filter(post => post.username === req.user.name));
})
app.get('/login', (req, res) => {
    //authenticate user


    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
    
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


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
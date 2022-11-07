const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();


//Port
const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
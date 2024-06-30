const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();


const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.listen(process.env.PORT, ()=>{
    console.log('listening on port 3000');
});


const userroutes = require('./routes/userroutes');
app.use('/user', userroutes);

const candidateroutes = require('./routes/candidateroutes');
app.use('/candidate', candidateroutes);


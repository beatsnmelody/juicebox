require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

server.use(morgan('dev'));

server.use(bodyParser.json());

const { client } = require('./db');
client.connect();

const apiRouter = require('./api');

server.use('/api', apiRouter);

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});

module.exports = server;
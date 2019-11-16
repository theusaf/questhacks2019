const express = require('express');
const request = require('request');
const ws = require('ws');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const server = http.createServer(app);

app.use(express.static("website"));
app.post("/response",(req,res)=>{

});

const socket = new ws.Server({server:server});

server.listen(3000);

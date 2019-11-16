const express = require('express');
const request = require('request');
const ws = require('ws');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const ip = require('ip');

app.use(express.static("website"));
app.post("/response",(req,res)=>{

});

const socket = new ws.Server({server:server});

const messages = [];
var clientId = 0;
const clients = {};

socket.on("connection",sock=>{
  clients[clientId] = new client;
  sock.id = clientId;
  sock.on("message",message=>{
    let data;
    try{
      data = JSON.parse(message);
    }catch(err){
      return;
    }
    messages.push(data);
  });
  sock.on("close",()=>{
    delete clients[sock.id];
  });
  sock.send(JSON.stringify({
    id: sock.id,
    messages: messages,
    type: "start"
  }));
});

class client{
  constructor(){
    this.name = "";
  }
}

server.listen(3000);
console.log(ip.address());

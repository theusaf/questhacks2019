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

function alertPeople(message){
  for(var i in clients){
    if(clients[i].id != message.id){
      clients[i].sock.send(JSON.stringify({
        message: message.message,
        name: `${message.name} [${message.id}]`,
        type: "chat"
      }));
    }
  }
}

socket.on("connection",sock=>{
  clients[clientId] = new client(clientId,sock);
  sock.id = clientId;
  sock.on("message",message=>{
    let data;
    try{
      data = JSON.parse(message);
    }catch(err){
      console.log("Uh oh an error");
      console.log(err);
      return;
    }
    messages.push(data);
    alertPeople(data);
  });
  sock.on("close",()=>{
    delete clients[sock.id];
  });
  sock.send(JSON.stringify({
    id: sock.id,
    messages: messages,
    type: "start"
  }));
  clientId++;
});

class client{
  constructor(id,sock){
    this.name = "";
    this.id = id;
    this.sock = sock;
  }
}

server.listen(3000);
console.log(ip.address());

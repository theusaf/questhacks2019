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
const md5 = require('md5');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("website"));
app.post("/login",(req,res)=>{
  const data = req.body;
  if(data.confirm){ // if signing up
    if(data.confirm != data.password || !data.password){ // passwords don't match
      res.status(400);
      res.send("Invalid password or unmatching password");
    }else{ // if valid passwords
      const people = fs.readFile(path.join(__dirname,"database.json"),"utf8",(err,info)=>{
        const data2 = JSON.parse(info);
        if(data2[data.username]){ // username taken
          res.status(400);
          res.send("Username taken");
        }else{ // yay!
          const newPassword = md5(data.password);
          data2[data.username] = {
            password: newPassword,
            data: {}
          };
          fs.writeFileSync(path.join(__dirname,"database.json"),JSON.stringify(data2));
          res.send("Success!");
        }
      });
    }
  }else{ // if logging in
    if(data.username){
      if(data.password){
        fs.readFile(path.join(__dirname,"database.json"),"utf8",(err,info)=>{
          const data2 = JSON.parse(info);
          if(!data2[data.username]){
            res.status(400);
            return res.send("Invalid Username");
          }
          if(data2[data.username].password == md5(data.password)){ // good
            res.header("wisp-data",JSON.stringify(data2[data.username].data));
            res.send("Success!");
          }else{
            res.status(400);
            res.send("Invalid password");
          }
        });
      }else{
        res.status(400);
        res.send("Missing password");
      }
    }else{
      res.status(400);
      res.send("Missing Username");
    }
  }
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
//<audio controls autoplay loop src="https://theusaf.github.io/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Video).m4a">

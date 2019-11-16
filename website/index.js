// first form
function submit(){
  const money = document.getElementById("income").value;
}
// second form
function submit2(){
  const percent = document.getElementById("percent").value;
  var totalSave = money*percent/100;
}
// send text
function chat(text){
  document.getElementById('chatInfo').value = "";
  if(text.length == 0){
    return;
  }
  chatSocket.send(JSON.stringify({
    id: id,
    name: name,
    message: text
  }));
  const t = document.createElement("p");
  t.innerHTML = `You: ${text}`;
  chatLog.append(t);
  chatLog.scrollTop = chatLog.scrollHeight;
}
// signup
function signup(){
  if(document.getElementById("loginBox")){
    return;
  }
  const container = document.createElement("div");
  const html = `<h1>Login</h1>`;
  container.innerHTML = html;
  container.id = "loginBox";
  document.body.append(container);
}

const chatSocket = new WebSocket(`ws://${location.host}`);
let id;
let name = "Anonymous User"

chatSocket.onmessage = function(e){
  const data = JSON.parse(e.data);
  switch (data.type) {
    case "start":
      id = data.id;
      for(var i in data.messages){
        const t = document.createElement("p");
        t.innerHTML = `${data.messages[i].name} [${data.messages[i].id}]: ${data.messages[i].message}`;
        chatLog.append(t);
      }
      chatLog.scrollTop = chatLog.scrollHeight;
      break;
    case "chat":
      const t = document.createElement("p");
      t.innerHTML = `${data.name}: ${data.message}`;
      chatLog.append(t);
      chatLog.scrollTop = chatLog.scrollHeight;
      break;
  }
}
const chatLog = document.getElementsByClassName("texts")[0];
const chatHide = document.getElementById("hideChat");

chatHide.onclick = function(){
  const a = document.getElementsByClassName("chat")[0];
  a.className = a.className == "chat hide" ? "chat" : "chat hide";
}

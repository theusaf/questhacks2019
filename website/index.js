// first form
const credentials = {
  pass: null,
  user: null,
  data: []
};
var dayStart;
var dayChange;
var dayPass;
var money;
var percent;
var monthlySave;
var goal;
var days;
var months;
var remainder;
const interest = 0.01;
const compounded = 1;

if(getCookie("username") && getCookie("password")){
  credentials.user = getCookie("username");
  credentials.pass = getCookie("password");
  login(credentials.user,credentials.pass);
  getData();
}

function submit(){
  money = Number(document.getElementById("income").value);
  submit2();
}
// second form
function submit2(){
  percent = Number(document.getElementById("amount").value);
  monthlySave = money*percent/100;
  submit3();
}
// calculate time
function submit3(){
  goal = Number(document.getElementById("goal").value);
  months = goal/monthlySave;
  days = Math.round(months*30.4666667);
  graph();
}
/*// income change
function submit4(){
  remainder = goal-monthlySave*dayPass/30.4666667;
  monthlySave = money*percent/100;
  months=remainder/monthlySave+dayPass/30.4666667;
  days = Math.round(months*30.4666667);
  submit5();
}
// percent change
function submit5(){
  monthlySave = money*percent/100;
}*/

function graph(){
  const x = new XMLHttpRequest();
  x.open("POST",`http://${location.host}/save`);
  x.setRequestHeader("content-type","application/json");
  const dat = {
    date: Date.now(),
    percent: percent,
    income: money,
    goal: goal,
    credentials: {
      pass: credentials.pass,
      user: credentials.user
    },
    savemonthly: monthlySave,
    days: days
  };
  x.send(JSON.stringify(dat));
  credentials.data.push(dat);
  drawStuff();
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
  const html = `<form class="login" action="javascript:login(document.getElementById('username').value,document.getElementById('password').value,document.getElementById('confirmPass').value)">
    <h2>Login</h2>
    <label>Username</label>
    <br>
    <input id="username">
    <br>
    <label>Password</label>
    <br>
    <input type="password" id="password">
    <br>
    <label>Confirm Password (if signing up)</label>
    <br>
    <input type="password" id="confirmPass">
    <br>
    <input type="submit" value="Go!">
    <button onclick="document.getElementById('loginBox').outerHTML = '';">Exit</button>
  </form>`;
  container.innerHTML = html;
  container.id = "loginBox";
  document.body.append(container);
}

// logging in
function login(user,pw,cpw){
  const x = new XMLHttpRequest();
  x.open("POST",`http://${location.host}/login`);
  x.setRequestHeader('content-type','application/json');
  x.send(JSON.stringify({
    username: user,
    password: pw,
    confirm: cpw
  }));
  x.onload = function(){
    if(x.response == "Success!"){
      setCookie("username",user,10);
      setCookie("password",pw,10);
      credentials.user = user;
      credentials.pass = pw;
      name = user;
      try{document.getElementById("loginBox").outerHTML = "";}catch(err){return;}
      alert("Logged in! (but not really)");
    }else{
      setCookie("username",user,-1);
      setCookie("password",pw,-1);
      credentials.user = null;
      credentials.pass = null;
      alert(x.response);
    }
  }
}

const chatSocket = new WebSocket(`ws://${location.host}`);
let id;
let name = "Anonymous User";

chatSocket.onmessage = function(e){
  const data = JSON.parse(e.data);
  switch (data.type) {
    case "start":
      id = data.id;
      for(var i in data.messages){
        const t = document.createElement("p");
        t.innerHTML = `${data.messages[i].name} [${data.messages[i].id}]: ${data.messages[i].message.replace(/</mg,"&lt;").replace(/>/mg,"&gt;")}`;
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

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getData(){
  const x = new XMLHttpRequest();
  x.open("POST",`http://${location.host}/get`);
  x.setRequestHeader("content-type","application/json");
  x.send(credentials);
}

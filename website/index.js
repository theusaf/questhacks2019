// first form
function submit(){
  const money = document.getElementById("income").value;
}
// second form
function submit2(){
  const percent = document.getElementById("percent").value;
  var totalSave = money*percent/100;
}

const chatSocket = new WebSocket("ws://localhost:3000");

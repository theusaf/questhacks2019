const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

ctx.fillStyle = "white";
ctx.fillRect(0,0,1000,1000);
drawAxis();

function drawAxis(){
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = "10";
  ctx.moveTo(80,0);
  ctx.lineTo(80,1000);
  ctx.moveTo(0,920);
  ctx.lineTo(1000,920);
  ctx.stroke();
  ctx.closePath();
  drawGoalLine();
  drawLabels();
}

function drawGoalLine(){
  ctx.beginPath();
  ctx.strokeStyle = "green";
  ctx.lineWidth = "4";
  ctx.moveTo(80,80);
  ctx.lineTo(1000,80);
  ctx.stroke();
  ctx.closePath();
}

function drawLabels(){
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.font = "50px Arial";
  ctx.fillText("Time",540,980);
  ctx.save();
  ctx.rotate(-90 * Math.PI / 180);
  ctx.fillText("Amount Saved",-480,40);
  ctx.restore();
}

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
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.font = "50px Arial";
  ctx.fillText("Time",540,980);
  ctx.save();
  ctx.rotate(-90 * Math.PI / 180);
  ctx.fillText("Amount Saved",-480,40);
  ctx.restore();
  ctx.closePath();
}

// I have no idea what i'm doing. help!
function drawStuff(){
  // create equation
  // y = mx (y = saved, x = days, m = daily)
  let i;
  const d = credentials.data
  ctx.beginPath();
  ctx.moveTo(80,920);
  ctx.strokeStyle = "black";
  ctx.lineWidth = "5";
  let left = 0;
  d.forEach(o=>{
    left+=o.days;
  }); // left represents total days
  for(i in d){
    const diff = Math.round(Date.now() - d[i].date) / 1000 / 360 / 24; // diff in days
    const day1 = d[i].savemonthly / 30.4666667; // daily cost
    const scalarX = 1000 / left;
    const scalarY = 1000 / goal;
    ctx.lineTo(80 + scalarX * (diff / left),980 - (diff * scalarY * day1));
    ctx.stroke();
  }
  // draw rest of line
  const day1 = d[i].savemonthly / 30.4666667;
  const scalarY = 1000 / goal;
  ctx.lineTo(1000,80);
  ctx.stroke();
  ctx.closePath();
}

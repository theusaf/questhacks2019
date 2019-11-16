const express = require('express');
const request = require('request');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.static("website"));
app.post("/response",(req,res)=>{
  
});

app.listen(3000);

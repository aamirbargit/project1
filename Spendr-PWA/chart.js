if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  };


//chart javascript file


const chart = document.querySelector(".chart"); //chart element 


const canvas = document.createElement("canvas"); //canvas element
canvas.width = 50; //canvas width
canvas.height = 50; //canvas height currently square canvas


chart.appendChild(canvas); //append canvas element to chart


const ctx = canvas.getContext("2d"); //to draw canvas get context


ctx.lineWidth = 8; //length of circle line 


const R = 20; //circle radius

function drawCircle(color, ratio, anticlockwise){

    ctx.strokeStyle = color; //red or white for expense or income
    ctx.beginPath();
    ctx.arc( canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise); // x, y, radius, start at angle 0, ratio, anticlockwise
    ctx.stroke();
}

function updateChart( income, outcome){ //update chart function 
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the rest of the canvas

    let ratio = income / (income+outcome);

    drawCircle("#FFFFFF", - ratio, true); //anticlockwise is true
    drawCircle("#f9433dcc", 1 - ratio, false); //anticlockwise is false
}
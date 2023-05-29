const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d");

let isDrawing = false,
brushWidth = 5;

window.addEventListener("load", () => {
    //setting canvas width/height returns viewable width/height of an element  
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDraw = () => {
    isDrawing = true;
    ctx.beginPath(); // cerating new path to draw 
    ctx.lineWidth = brushWidth; //passing brushsize as line width
}

//writing drawing function enables the drawing feature before adding startdraw and after added startDraw we can actually draw from the tip of mouse pointer
const drawing = (e) => {
    if(!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke();// drawing/filling line with color
}       

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
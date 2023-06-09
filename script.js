const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");


//global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas backgroud to white , so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it will be the brush color 
}


window.addEventListener("load", () => {
    //setting canvas width/height returns viewable width/height of an element  
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // fi fillcolor isn't checked draw a rect with border else draw rect with backgorund
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY , prevMouseX - e.offsetX, prevMouseY - e.offsetY);    
    }
    ctx.fillRect(e.offsetX, e.offsetY , prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius from the circle according to the mouse painter
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX),2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 50, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillcolor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving traingle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating buttom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw 
    ctx.lineWidth = brushWidth; //passing brushsize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as fill style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

//writing drawing function enables the drawing feature before adding startdraw and after added startDraw we can actually draw from the tip of mouse pointer
const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);// adding copied canvas data on this canvas

    if(selectedTool === "brush" || selectedTool === "eraser"){
        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke();// drawing/filling line with color
    } else if(selectedTool === "rectangle"){
        drawRect(e); 
    }
    else if(selectedTool === "circle"){
        drawCircle(e); 
    }
    else{
        drawTriangle(e); 
    }
    
}       

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
});



sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brush size

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing selected class from the prevous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selected value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
});


colorPicker.addEventListener("change", () => {
    //passing picked color value from color picker to last colot btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width,canvas.height); // clearing whole canvas
    setCanvasBackground();
});


saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking line to download image

});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
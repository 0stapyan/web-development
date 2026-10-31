const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const drawModeBtn = document.getElementById('drawMode');
const eraseModeBtn = document.getElementById('eraseMode');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clearCanvas');
const penSizeInput = document.getElementById('penSize');
const colorPicker = document.getElementById('colorPicker');
const stampModeBtn = document.getElementById('stampMode');
const stampImage = document.getElementById('stampImage');

let isDrawing = false;
let drawMode = true;
let penSize = penSizeInput.value;
let penColor = colorPicker.value;
let canvasStates = [];
let stampMode = false;

function saveCanvasState() {
  canvasStates.push(canvas.toDataURL());
}

canvas.addEventListener('mousedown', (e) => {
  if (!stampMode) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round'; // Smooth ends
    ctx.strokeStyle = drawMode ? penColor : '#FFFFFF'; // Use white for erasing
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', () => {
  if (!stampMode) {
    isDrawing = false;
    ctx.closePath();
    saveCanvasState();
  }
});

penSizeInput.addEventListener('input', (e) => {
  penSize = e.target.value;
});

colorPicker.addEventListener('input', (e) => {
  penColor = e.target.value;
});

drawModeBtn.addEventListener('click', () => {
  drawMode = true;
  stampMode = false;
});

eraseModeBtn.addEventListener('click', () => {
  drawMode = false;
  stampMode = false;
});

undoBtn.addEventListener('click', () => {
  if (canvasStates.length > 0) {
    const prevState = new Image();
    prevState.src = canvasStates.pop();
    prevState.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(prevState, 0, 0);
    };
  }
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasStates = [];
});

stampModeBtn.addEventListener('click', () => {
  stampMode = true;
  drawMode = false;
  console.log('Stamp mode activated');
});

canvas.addEventListener('click', (e) => {
  if (stampMode && stampImage.complete) {
    const x = e.offsetX - stampImage.width / 2;
    const y = e.offsetY - stampImage.height / 2;

    ctx.drawImage(stampImage, x, y);
    saveCanvasState();
    stampMode = false;
  }
});

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var selectedShape;

document.querySelectorAll('input[name="shape"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        selectedShape = this.value;
    });
});

function selectShape() {
    var selectedRadioButton = document.querySelector('input[name="shape"]:checked');
    if (selectedRadioButton) {
        selectedShape = selectedRadioButton.value;
    }
}

function mousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function handleMouseClick(event) {
    var pos = mousePos(canvas, event);
    // alert('Clicked at coordinates: X=' + pos.x + ', Y=' + pos.y);
    if (selectedShape === 'rectangle') {
        drawRectangle(pos.x, pos.y);
    } else if (selectedShape === 'circle') {
        drawCircle(pos.x, pos.y);
    } else if (selectedShape === 'triangle') {
        drawTriangle(pos.x, pos.y);
    }
}
canvas.addEventListener('click', handleMouseClick);

function drawRectangle(x, y) {
    context.beginPath();
    context.rect(x, y, 100, 250);
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = 7;
    context.strokeStyle = 'black';
    context.stroke();
}

function drawCircle(x, y) {
    context.beginPath();
    context.arc(x, y, 70, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 7;
    context.strokeStyle = 'black';
    context.stroke();
}

function drawTriangle(x, y) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 100, y + 250);
    context.lineTo(x - 100, y + 250);
    context.fillStyle = 'blue';
    context.fill();
    context.lineWidth = 7;
    context.strokeStyle = 'black';
    context.stroke();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
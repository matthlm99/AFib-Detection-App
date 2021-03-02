function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function log(msg) {
    logElement.innerHTML = msg + "\n";
}

// Video recording stop function
function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
}

// Process video frame data
function computeFrame(){
    if (!display.onplaying) {
        return;
    }
    else{
        context_temp.drawImage(display, 0, 0, display.videoWidth , display.videoHeight );
        let frame = context_temp.getImageData(0, 0, display.videoWidth , display.videoHeight );
    
        let red_frame = [];
        for (let i = 0; i < frame.data.length /4; i++) {
            red_frame.push(frame.data[i * 4]);
        }
        let redAverage = 0;
        for (let i = 0; i < red_frame.length; i++){
            redAverage += red_frame[i];
        }
        redAverage = redAverage / red_frame.length;
        console.log("red average= " + redAverage);
        context_1.putImageData(frame, 0, 0);
        setTimeout(computeFrame, 100);
    }
}

// ---------------------------------------------------------------------

// Main method starts here...
// Establishing global variables...
let display = document.getElementById("display");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let videoMessage = document.getElementById("overlay-message");
let logElement = document.getElementById("log");
let recordingTimeMS = 15000;

// Establish canvas variables
let red_value = [];
let canvas_1 = document.getElementById('output-canvas');
let context_1 = canvas_1.getContext('2d');
let canvas_temp = document.createElement('canvas');
/*canvas_temp.setAttribute('width', 500);
canvas_temp.setAttribute('height', 600);*/
context_temp = canvas_temp.getContext('2d');

//let plot_button = document.getElementById("chart-plot");

// Some predefined messages...
var recording_message = "Recording pulse...";
var brightness_message = "Room too dark!";
var pressure_message = "Try pressing more firmly";

// Setting up recording event by the user
startButton.addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream)=>{
        //videoMessage.innerText = recording_message;
        display.srcObject = stream;
        display.captureStream = display.captureStream || display.mozCaptureStream;
        return new Promise(resolve => display.onplaying = resolve);
        }).then(computeFrame)
}, false);

// Event listener for stopping recording
stopButton.addEventListener("click", function() {
    //videoMessage.innerText = "";
    stop(display.srcObject);
}, false);
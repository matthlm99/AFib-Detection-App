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
        // Establish canvas template
        let canvas_width = canvas_1.clientWidth;
        let canvas_height = canvas_1.clientHeight;
        context_temp.drawImage(display, 0, 0, canvas_width, canvas_height);
        let frame = context_temp.getImageData(0, 0, canvas_width, canvas_height);

        // Red processing and feedback
        const center = ((canvas_width*canvas_height)/2)-1,
        UL = 0,
        UR = (canvas_width-1),
        BL = (canvas_width*(canvas_height-1))-1,
        BR = (canvas_width*(canvas_height))-1;

        var rcent = frame.data[(4*center)];
        var rgCent = frame.data[(4*center)]/frame.data[(4*center)+1];
        var rbCent = frame.data[(4*center)]/frame.data[(4*center)+2];
        var redCornMax = Math.max(frame.data[(4*UL)],frame.data[(4*UR)],frame.data[(4*BL)],frame.data[(4*BR)]);
        var greenCornMax = Math.max(frame.data[(4*UL)+1],frame.data[(4*UR)+1],frame.data[(4*BL)+1],frame.data[(4*BR)+1]);
        var redCornMin = Math.min(frame.data[(4*UL)],frame.data[(4*UR)],frame.data[(4*BL)],frame.data[(4*BR)]);
        var greenCornMin = Math.min(frame.data[(4*UL)+1],frame.data[(4*UR)+1],frame.data[(4*BL)+1],frame.data[(4*BR)+1]);
        var rgCornMax = redCornMax/greenCornMax;
        var rgCornMin = redCornMin/greenCornMin;

        var Red = 0;
        var Green = 0;

        for (i = 0; i < frame.data.length-1; i = i + 4){
            Red = Red + frame.data[i];
        }
        Red = Red/(frame.data.length/4);

        // Finger feedback and tracking
        if (rgCent < 7){
            videoMessage.innerText= "Place Finger Over Camera"
            Finger = 0;
            RedAv = [];
        }
        else if (rgCent > 7){
            videoMessage.innerText= "";
            if (!Finger){
                Finger = 0;
            }
            Finger = Finger + 1;
            if (rcent < 60){
                videoMessage.innerText = "Too Dark"
                Finger = 0;
                RedAv = [];
            }          
        }
        if (Finger >= 10 && Finger<40){
            videoMessage.innerText= "3";
        }
        if (Finger >= 40 && Finger<70){
            videoMessage.innerText= "2";
        }
        if (Finger >= 70 && Finger<100){
            videoMessage.innerText= "1";
        }

        if (Finger >= 100 && Finger<300){
            videoMessage.innerText= "Collecting . . .";
            RedAv.push(Red);
        }
        else if (Finger >= 300){
            videoMessage.innerText= "Done";
        }

        // Wrap up frame calculation and recurse
        context_1.putImageData(frame, 0, 0);
        setTimeout(computeFrame, (1000 / 30) + 1);
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

// Establish canvas variables
let red_value = [];
let canvas_1 = document.getElementById('output-canvas');
let context_1 = canvas_1.getContext('2d');
let canvas_temp = document.createElement('canvas');
var window_width = window.innerWidth;
var window_height = window.innerHeight;
// Regulate canvas dimensions
if (window_width < window_height){
    canvas_1.height = 400;
    canvas_1.width = 300;
}
else if (window_width > window_height){
    canvas_1.height = 300;
    canvas_1.width = 400;
}
context_temp = canvas_temp.getContext('2d');

// Some predefined messages...
var recording_message = "Recording pulse...";
var brightness_message = "Room too dark!";
var pressure_message = "Try pressing more firmly";

// Setting up recording event by the user
window.addEventListener("load", () => {
    navigator.mediaDevices
        .getUserMedia({video: {facingMode: 'user', frameRate: 30}, audio: false})
        .then((stream)=>{
            display.srcObject = stream;
            display.captureStream = display.captureStream || display.mozCaptureStream;
            return new Promise(resolve => display.onplaying = resolve);
            }).then(computeFrame)
            console.log(red_value);
    }, false);

// Event listener for stopping recording
stopButton.addEventListener("click", function() {
    //videoMessage.innerText = "";
    stop(display.srcObject);
}, false);
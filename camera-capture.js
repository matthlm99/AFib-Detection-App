// This script uses the getUserMedia() function to access any inherent camera in the device

// Establishing global variables...
let display = document.getElementById("display");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let videoMessage = document.getElementById("overlay-message");
let logElement = document.getElementById("log");
let recordingTimeMS = 15000;

// Utility functions
function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function log(msg) {
    logElement.innerHTML = msg + "\n";
}
// Main function for recording a video stream
async function startRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let video_data = [];

    recorder.ondataavailable = event => video_data.push(event.data);
    recorder.start();
    if (recorder.state == "recording"){
        log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");
    } else{
        log("Error; not recording");
    }

    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = event => reject(event.name);
    });

    let recorded = wait(lengthInMS).then(function(){
        recorder.state == "recording" && recorder.stop()
    });
    
    // returns video recording data when promise is resolved
    await Promise.all([stopped, recorded]);
    return video_data;
}

// Video recording stop function
function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
}

// Some predefined messages...
var recording_message = "Recording pulse...";
var brightness_message = "Room too dark!";
var pressure_message = "Try pressing more firmly";

// Setting up recording event by the user
startButton.addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({video: true}).then(function(stream){
        videoMessage.innerText = recording_message;
        display.srcObject = stream;
        downloadButton.href = stream;
        display.captureStream = display.captureStream || display.mozCaptureStream;
        return new Promise(resolve => display.onplaying = resolve);
        }).then(function(){
            startRecording(display.captureStream(), recordingTimeMS).then(function(recordedChunks){
                videoMessage.innerText = "";
                let recordedBlob = new Blob(recordedChunks, {type: "video/mp4"});
                let videoURL = window.URL.createObjectURL(recordedBlob);
                recording.src = videoURL;
                downloadButton.href = videoURL
                downloadButton.download = "pulse_video";
                })
            })
    .catch(log);
}, false);
// Event listener for stopping recording
stopButton.addEventListener("click", function() {
    videoMessage.innerText = "";
    log("");
    stop(display.srcObject);
}, false);
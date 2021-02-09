// This script uses the getUserMedia() function to access any inherent camera in the device

// Establishing global variables...
let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");
let recordingTimeMS = 5000;

// Utility functions
function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}
function log(msg) {
    logElement.innerHTML += msg + "\n";
}
// Main function for recording a video stream
function startRecording(stream, lengthInMS) {
    let recording = new MediaRecorder(stream);
    let video_data = [];
  
    recording.ondataavailable = event => video_data.push(event.data);
    recording.start();
    log(recording.state + " for " + (lengthInMS/1000) + " seconds...");
  
    let stopped = new Promise((resolve, reject) => {
      recording.onstop = resolve;
      recording.onerror = event => reject(event.name);
    });
  
    let recorded = wait(lengthInMS).then(() => recording.state == "recording" && recording.stop()
    );
  
    return Promise.all([stopped,recorded])
    .then(() => data);
}

// Video recording stop function
function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
}


// Setting up recording event by the user
startButton.addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
      preview.srcObject = stream;
      downloadButton.href = stream;
      preview.captureStream = preview.captureStream;
      return new Promise(resolve => preview.onplaying = resolve);
    }).then(() => startRecording(preview.captureStream(), recordingTimeMS))
    .then (recordedChunks => {
      let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
      recording.src = URL.createObjectURL(recordedBlob);
      downloadButton.href = recording.src;
      downloadButton.download = "RecordedVideo.webm";
  
      log("Successfully recorded " + recordedBlob.size + " bytes of " +
          recordedBlob.type + " media.");
    })
    .catch(log);
}, false);

stopButton.addEventListener("click", function() {
    stop(preview.srcObject);
}, false);

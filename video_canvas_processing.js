function putImage(){
    var w =  cameraCanvas.clientWidth;
    var h =  cameraCanvas.clientHeight;
    // maintain 3 : 4 aspect ratio
    if (window.clientWidth > window.clientHeight){ // landscape format
        h = (3/4) * w;
    } else { // portrait format
        w = (3/4) * h;
    }
    context.drawImage(video,0,0,w,h);
    let frame = context.getImageData(0, 0, w, h);
    context.putImageData(frame, 0, 0);
}

// ------- Main Method ---------
var video = document.getElementById('input-video');
var cameraCanvas = document.getElementById('output-canvas');
var context = cameraCanvas.getContext("2d");

// Portrait vs Landscape orientation
if (window.clientWidth > window.clientHeight){ // landscape format

}
cameraCanvas.width = window.innerWidth;
cameraCanvas.height = window.innerHeight;
console.log(cameraCanvas.height);
window.addEventListener('load', () =>{
    navigator.mediaDevices
    .getUserMedia({video: {facingMode: 'user', frameRate: 30}, audio: false})
    .then((stream) =>{
        video.srcObject = stream;
        video.captureStream = video.captureStream || video.mozCaptureStream;
        putImage();
    })
})
setInterval(putImage, 30);
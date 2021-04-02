// Video Processing functions
function init() {
    video = document.getElementById('input-video');
    red_value = [];

    c1 = document.getElementById('output-canvas');
    ctx1 = c1.getContext('2d');

    c_tmp = document.createElement('canvas');
    c_tmp.setAttribute('width', 300);
    c_tmp.setAttribute('height', 350);
    ctx_tmp = c_tmp.getContext('2d');

    video.addEventListener('play', computeFrame);
}

function computeFrame() {
    if (video.paused || video.ended) {
    return;
    }
    ctx_tmp.drawImage(video, 0, 0, video.videoWidth , video.videoHeight );
    let frame = ctx_tmp.getImageData(0, 0, video.videoWidth , video.videoHeight );

    let red_frame = [];
    for (let i = 0; i < frame.data.length /4; i++) {
        red_frame.push(frame.data[i * 4]);
    }
    let redAverage = 0;
    for (let i = 0; i < red_frame.length; i++){
        redAverage += red_frame[i];
    }
    redAverage = redAverage / red_frame.length;
    red_value.push(redAverage);
    ctx1.putImageData(frame, 0, 0);
    setTimeout(computeFrame, 0);
}

// ---Main Method---
let video, c1, ctx1, c_tmp, ctx_tmp, red_value;
init();

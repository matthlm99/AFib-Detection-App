// Set constraints for the video stream
var constraints = { video:{ 
    facingMode: "user",
    frameRate: { min: 30, ideal: 30 },
    exposureMode: "none",
    whiteBalanceMode: "none",

    }, audio: false 
};
var prevRed = 0;
var Finger = 0;
var RedAv = [];
var RedAvFilt = [];
var Fin = 0;
var FR;
var FPS
var A = [];
var B = [];
var Norm;
var ctxWave ;
var waveData ;
var kik = 1;





// Define constants
const cameraView = document.querySelector("#view"),
    cameraCanvas = document.querySelector("#canvas"),
    Restart = document.querySelector("#restart"),
    Feedback = document.querySelector("#feedback"),
    HR = document.querySelector("#HR"),
    Wave = document.querySelector("#wave")
//
var loader_object = document.getElementById('heartbeat-loader')
loader_object.style.visibility = 'hidden';

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;

        FR = track.getSettings().frameRate;
        console.log(FR);

        if (FR == 30){
            B = [0.3375, 0, -0.3375];
            A = [1, -1.2471, 0.3249];
            FPS = 30;
        }
        else if (FR == 60){
            B = [0.3206, 0, -0.3206];
            A = [1, -1.3399, 0.3589];
            FPS = 60;
        }
        HR.innerHTML = String(FR).concat(' FPS');

        ctxWave = Wave.getContext('2d');
        waveData = ctxWave.createImageData(Wave.width, Wave.height);

        
    })
    
    .catch(function(error) {
        console.error("Error", error);
    });
    
}


function ImStream(){
            
            
            var wWidth = window.innerWidth;
            var wHeight = window.innerHeight;
            
            if (wWidth<wHeight){
                cameraCanvas.height = 225;
                cameraCanvas.width = 300;
                Wave.height = 225;
                Wave.width = 300;
                Feedback.style.width = '300px';
                Feedback.style.height = '225px';
            }

            else if (wWidth > wHeight){
                cameraCanvas.height = 300;
                cameraCanvas.width = 400;
                Wave.height = 300;
                Wave.width = 400;
                Feedback.style.width = '400px';
                Feedback.style.height = '300px';
            }
            

            
            var context = cameraCanvas.getContext('2d');
            

            const w = cameraCanvas.clientWidth;
            const h = cameraCanvas.clientHeight;
            context.drawImage(cameraView,0,0,w,h);
        

            
            const center = ((w*h)/2)-1;
            const UL = 0;
            const UR = (w-1);
            const BL = (w*(h-1))-1;
            const BR = (w*(h))-1;

            const FT = 40;      

            var canvasColor = context.getImageData(0, 0, w, h);
            var pixels = canvasColor.data;
            var rcent = pixels[(4*center)];
            var rgCent = pixels[(4*center)]/pixels[(4*center)+1];
            var rbCent = pixels[(4*center)]/pixels[(4*center)+2];

        

           var redCornMax = Math.max(pixels[(4*UL)],pixels[(4*UR)],pixels[(4*BL)],pixels[(4*BR)]);
            var greenCornMax = Math.max(pixels[(4*UL)+1],pixels[(4*UR)+1],pixels[(4*BL)+1],pixels[(4*BR)+1]);
            var redCornMin = Math.min(pixels[(4*UL)],pixels[(4*UR)],pixels[(4*BL)],pixels[(4*BR)]);
            var greenCornMin = Math.min(pixels[(4*UL)+1],pixels[(4*UR)+1],pixels[(4*BL)+1],pixels[(4*BR)+1]);
            var rgCornMax = redCornMax/greenCornMax;
            var rgCornMin = redCornMin/greenCornMin;
            var rgCorn = rgCornMax/rgCornMin
            var Red = 0;
            var Green = 0;

            for (i = 0; i < pixels.length-1; i = i + 4){
                Red = Red + pixels[i];
            }
            Red = -(Red/(pixels.length/4));
            

            //for (i = 1; i < pixels.length-1; i = i + 4){
               // Green = Green + pixels[i];
            //}
           // Green = Green/(pixels.length/4);
            
           
            if (Fin == 0){
            //Detect Finger
            if (rgCent < 2 && rbCent < 2){
                
                Feedback.innerHTML = "Place Finger Over Camera"
                Finger = 0;
                RedAv = [];
                RedAvFilt = [];
                waveData = ctxWave.createImageData(Wave.width, Wave.height);
                
            }
                    

            else if (rgCent > 2 && rbCent > 2){

                if (rcent< 3){
                    Feedback.innerHTML = "Too Dark"
                    Finger = 0;
                    RedAv = [];
                    RedAvFilt = [];
                    waveData = ctxWave.createImageData(Wave.width, Wave.height);
                }
                else{
                    Feedback.innerHTML = "";
                    Finger = Finger + 1;
                    
                }
                
            }
            if (Finger >= Math.round((0)*FPS) && Finger < Math.round((1)*FPS)){
                RedAv.push(Red);
            }
            if (Finger >= Math.round((1)*FPS)){
                RedAv.push(Red);
                var n = Finger-28;
                RedAvFilt[0] = B[0] * RedAv[n-2];
                RedAvFilt[1] = B[0] * RedAv[n-1] + B[1] * RedAv[n-2] - A[1] * RedAvFilt[0];
                RedAvFilt[n] = B[0] * RedAv[n] + B[1] * RedAv[n-1] + B[2] * RedAv[n-2] - A[1] * RedAvFilt[n-1] - A[2] * RedAvFilt[n-2];
                    
            }

            if (Finger >= Math.round((1)*FPS) && Finger<Math.round((2)*FPS)){
                Feedback.innerHTML = "3";
            
            }
            if (Finger >= Math.round((2)*FPS) && Finger<Math.round((3)*FPS)){
                Feedback.innerHTML = "2";
                
            }
            if (Finger >= Math.round((3)*FPS) && Finger<Math.round((4)*FPS)){
                Feedback.innerHTML = "1";
            
                
            }
          
            if (Finger >= Math.round((4)*FPS) && Finger<Math.round((14))*FPS){
                Feedback.innerHTML = "Collecting . . .";
                loader_object.style.visibility = 'visible';
                
                
                
                if (Finger >= (Math.round((4)*FPS))+1){
                    function paintPix(x,y){

                        var Index = ((y*400) + x) * 4;
    
                        waveData.data[Index+2] = 255;
                        waveData.data[Index+3] = 255; 
    
                        waveData.data[Index+4+2] = 255;
                        waveData.data[Index+3+4] = 255; 
    
                        waveData.data[Index-4+2] = 255;
                        waveData.data[Index+3-4] = 255;
    
                        waveData.data[Index+1600+2] = 255;
                        waveData.data[Index+3+1600] = 255;
    
                        waveData.data[Index-1600+2] = 255;
                        waveData.data[Index+3-1600] = 255;
                        
    
                    }
                    var x_1 = Finger-121;
                    var x_2 = Math.round((Finger-120));

                    var y_1 = (RedAvFilt[x_1+90]*-10)+150;
                    var y_2 = Math.round((RedAvFilt[x_2+90]*-10)+150);
                    

                    
                    HR.innerHTML = String(y_2);
                    paintPix(x_2,y_2);
                    ctxWave.putImageData(waveData, 0, 0);
                    
                }
            }



            
            else if (Finger >= 420){
                RedAv = RedAv.slice(120,420);
                Feedback.innerHTML = "Done";
                loader_object.style.visibility = 'hidden';
                waveData = ctxWave.createImageData(Wave.width, Wave.height);
                const doneEvent = new Event('doneEvent');
                window.dispatchEvent(doneEvent);
                Fin = 1;
            }
        }

            
            
};


// Start the service Worker when the window loads
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
     navigator.serviceWorker.register( 'service-worker.js').then( () => {
      console.log('Service Worker Registered')
     })
   })
}

window.addEventListener("load", cameraStart, false);


// Set Canvas to Paint at 30 FPS
var FrameRate = setInterval(ImStream, ((1/30)*1000));
//ctxWave.beginPath();

window.addEventListener("doneEvent",dataProcess, false);


Restart.onclick = function(){
    Fin = 0;    
}

function dataProcess() {
	
	
	
	function findpeaks(signal1,window){
		signal1.splice(0,50);
		var signal = [0];
		for (n = 0; n < signal1.length; n++){
			var start1 = Math.max(0, n - 1);
			var finish1 = Math.min(signal1.length, n + 1);
			var sum1 = 0;
			for (m = start1; m < finish1; m++){
				sum1 += signal1[m];
			}
			var avg1 = sum1 / (finish1 - start1 + 1);
			signal.push(avg1);
		}
		signal.shift();
		var threshold = [0];
		for (i = 0; i < signal.length; i++){
			var start = Math.max(0, i - 25);
			var finish = Math.min(signal.length, i + 25);
			var sum = 0;
			for (j = start; j < finish; j++){
				sum += signal[j];
			}
			var avg = sum / (finish - start + 1);
			threshold.push(avg);
		}
		threshold.shift();
		var peaks = [0];
		for (k = 2; k < signal.length; k++){
			if (signal[k] < signal[k-1]){
				if (signal[k-2] < signal[k-1]){
					if (signal[k-1] > threshold[k-1]){
						if (k > peaks[peaks.length - 1] + window){
							peaks.push(k-1);
						}
					}
				}
			}
		}
		peaks.shift();
		return peaks;
	}
    	var locs = findpeaks(RedAvFilt,15);
    	var RR = [locs[1]-locs[0]];
    	for (j = 2; j < locs.length; j++){
        	RR.push(locs[j]-locs[j-1]);
    	}
    	var total = 0;
    	for (k = 0; k < RR.length; k++){
        	total += RR[k];
    	}
    	var HeartRate = 1800 * RR.length / total;
    	HR.innerHTML = String(locs).concat(' bpm');
	
}
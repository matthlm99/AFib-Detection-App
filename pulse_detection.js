// Set constraints for the video stream
var constraints = { video:{ 
  facingMode: "user",
  frameRate: { min: 30, ideal: 60 }, //Adjust ideal to 60 to increase max frame rate
  exposureMode: "none",
  whiteBalanceMode: "none",

  }, audio: false 
};
// Timing and Storage
var Finger = 0;
var Fin = 0;
var RedAv;
var RedAvFilt;
var FPS;
var FrameRateSet;
var FR;

// Filter Coeffs
var A = [];
var B = [];

//AFD algorithm and Peak Finding
var pulse_t = [];
var pulse_n = [];
var AF = [];
var signal = [];
var threshold = [0,0];
var locs = [0];


//Canvas Sizing and Plitting
var ctxWave ;
var waveData ;
var REQ;

var wWidth = 0;
var wHeight = 0;

var x_1;
var x_2;
var x_1p;
var x_2p;
var y_1;
var y_2;

//Toggling Variable
var toggle = 0;
var current = 0;
var frameSwitch = 0;










// Define constants [HTML Elements]
const cameraView = document.querySelector("#camera-view"),
  cameraCanvas = document.querySelector("#camera-canvas"),
  Restart = document.querySelector("#restart-button"),
  Feedback = document.querySelector("#feedback"),
  FeedbackColor = document.querySelector("#feedback-color"),
  HR = document.querySelector("#HR"),
  rhythm = document.querySelector("#rhythm"),
  Wave = document.querySelector("#wave"),
  Main = document.querySelector("#main-space"),
  appSpace = document.querySelector("#app-space"),
  fadeSpace = document.querySelector("#fade-space"),
  loaderIcon = document.querySelector("#loaderIcon"),
  checkingIcon = document.querySelector("#checkingIcon"),
  doneIcon = document.querySelector("#doneIcon"),
  downloadButton = document.querySelector("#download-button"),
  dataButton = document.querySelector("#data-button"),
  helpButton = document.querySelector("#help-button"),
  switchButton = document.querySelector("#switch-button"),
  fingerAnimation = document.querySelector("#finger-animation"),
  preLoad = document.querySelector("#pre-loader")

//
downloadButton.disabled = true; // disable download button pre-collection


// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
    track = stream.getTracks()[0];
    cameraView.srcObject = stream;

    FR = track.getSettings().frameRate;


    //Set up canvases based on framerate and screen dimensions

    wWidth = window.innerWidth;
    wHeight = window.innerHeight;
    if (FR >= 29 && FR <= 31){
      B = [0.3375, 0, -0.3375];
      A = [1, -1.2471, 0.3249];
      FPS = 30;
      Wave.height = 400;
      Wave.width = FPS*32/2;
    }
    else if (FR >= 59 && FR <= 61){
      B = [0.3206, 0, -0.3206];
      A = [1, -1.3399, 0.3589];
      FPS = 60;
      Wave.height = 400;
      Wave.width = FPS*32/2;
    }
  
    
    

    if (wWidth < wHeight){
      cameraCanvas.height = wWidth*(3/4);
      cameraCanvas.width = wWidth;
      Wave.style.height = String(wWidth/1.9)+"px";
      Wave.style.width = String(wWidth)+"px";
      
    }

    if (wWidth > wHeight){
      cameraCanvas.height = wHeight*(3/4);
      cameraCanvas.width = wHeight;
      Wave.style.height = String(wHeight/1.9)+"px"; //2.0
      Wave.style.width = String(wWidth - 165)+"px";
    
    }
    ctxWave = Wave.getContext('2d');
    waveData = ctxWave.createImageData(Wave.width, Wave.height);

    RedAv = new Array(FPS*37);
    RedAvFilt = new Array(FPS*37);

    //frameRateSet(FPS);
    FrameRateSet = setInterval(ImStream, ((1/FPS)*1000));

    // Display Frame Rate for debugging
    HR.innerHTML = String(FR);
      
  })
  
  .catch(function(error) {
      console.error("Error", error);
  });
  
}

// Function for clearing the waveform canvas [call to clear it]
function clearWave(){
  ctxWave.beginPath();
  ctxWave.clearRect(0, 0, Wave.width, Wave.height); 
  ctxWave.stroke();
}  

// Main Loop [Triggered at interval = Framerate]
function ImStream(){

  

  // Handle orientation changing
  if (wWidth !== window.innerWidth && wHeight !== window.innerHeight){
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;
    
    if (wWidth<wHeight){
      cameraCanvas.height = wWidth*(3/4);
      cameraCanvas.width = wWidth;
      Wave.style.height = String(wWidth/1.9)+"px";
      Wave.style.width = String(wWidth)+"px";
    }

    else if (wWidth > wHeight){
      cameraCanvas.height = wHeight*(3/4);
      cameraCanvas.width = wHeight;
      Wave.style.height = String(wHeight/1.9)+"px"; //2.0
      Wave.style.width = String(wWidth-165)+"px";
    }
   
  }
  
  
  // Paint Video -> Camera Canvas
  var context = cameraCanvas.getContext('2d');
  const w = cameraCanvas.clientWidth;
  const h = cameraCanvas.clientHeight;
  context.drawImage(cameraView,0,0,w,h);


  // Canvas Pixel Processing
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
    Green = Green + pixels[i+1];
  }
  Red = -(Red/(pixels.length/4));
  Green = -(Green/(pixels.length/4));

  rgCent = Red/Green;
  
  // Processing
  if (Fin == 0){
    


    //Detect Finger

    // No Finger
    if (rgCent < 1.8){
      FeedbackColor.style.backgroundColor = 'rgba(255, 148, 180, 0)';
      loaderIcon.style.opacity = "0";
      checkingIcon.style.opacity = "0";
      fingerAnimation.style.opacity = "1";
        
        
      Feedback.innerHTML = ""
      Finger = 0;
      RedAv = [];
      RedAvFilt = [];
      clearWave();
    }
          
    // Yes Finger
    if (rgCent > 1.1){
      
        

      if (Finger < FPS*1 && rgCent > 1.8){
        FeedbackColor.style.backgroundColor = 'rgba(213, 236, 199,1)';
        Feedback.innerHTML = "";
        Finger = Finger + 1;  
        fingerAnimation.style.opacity = "0";
        checkingIcon.style.opacity = "1";
        
        
      }
      else if (Finger >= FPS*1 && Finger < FPS*2 && rgCent > 1.6){
        FeedbackColor.style.backgroundColor = 'rgba(213, 236, 199,1)';
        Feedback.innerHTML = "";
        Finger = Finger + 1;  
        checkingIcon.style.opacity = "1";
      }
      else if (Finger >= FPS*2 && Finger < FPS*3 && rgCent > 1.4){
        FeedbackColor.style.backgroundColor = 'rgba(213, 236, 199,1)';
        Feedback.innerHTML = "";
        Finger = Finger + 1;  
      }
      else if (Finger >= FPS*3 && rgCent > 1.1){
        FeedbackColor.style.backgroundColor = 'rgba(213, 236, 199,1)';
        Feedback.innerHTML = "";
        Finger = Finger + 1;  
        
      }
        
    }
    if (Finger >= Math.round((0)*FPS) && Finger < Math.round((1)*FPS)){
      RedAv.push(Red);
    }

    if (Finger >= Math.round((1)*FPS)){
      RedAv.push(Red);
      var n = Finger-FPS+2;
      RedAvFilt[0] = B[0] * RedAv[FPS-2];
      RedAvFilt[1] = B[0] * RedAv[FPS-1] + B[1] * RedAv[FPS-2] - A[1] * RedAvFilt[0];
      RedAvFilt[n] = B[0] * RedAv[n+FPS-2] + B[1] * RedAv[n+FPS-3] + B[2] * RedAv[n+FPS-4] - A[1] * RedAvFilt[n-1] - A[2] * RedAvFilt[n-2];

      if (n < 5*FPS - (5/6 * FPS)){
        threshold.push(0);
      }
      if (n >= 5*FPS){
        var start = n - 5/3 * FPS;
        var finish = n;
        var sum = 0;
        for (j = n - 5/3 * FPS; j < n+1; j++){
          sum += RedAvFilt[j];
        }
        var avg = sum / (finish - start + 1);
        threshold.push(avg);
	if (RedAvFilt[n - 5/6 * FPS + 1] < RedAvFilt[n - 5/6 * FPS]){
		if (RedAvFilt[n - 5/6 * FPS] > threshold[n - 5/6 * FPS]){
			if (n - 5/6 * FPS > locs[locs.length - 1] + FPS/2){			
				locs.push(n - 5/6 * FPS);
			}
			else if (n - 5/6 * FPS < locs[locs.length - 1] + FPS/3 && RedAvFilt[n - 5/6 * FPS] > RedAvFilt[locs[locs.length - 1]]){
				locs[locs.length - 1] = n - 5/6 * FPS;
			}
		}
	}
      }
    }
    
    if (Finger >= Math.round((5)*FPS) && Finger<Math.round((37))*FPS){
      Feedback.innerHTML = String(32 - Math.floor((Finger-Math.round((4)*FPS))/FPS));

      loaderIcon.style.opacity = "1";
        
        
        
      if (Finger >= (Math.round((5)*FPS)+1)){
        // Paint Waveform on Canvas
        if (Finger <= (Math.round((21)*FPS))){
          x_1 = (Finger-1-(FPS*5));
          x_2 = (Finger-(FPS*5));
          x_1p = x_1;
          x_2p = x_2;
        }
        
        else if (Finger > (Math.round((21)*FPS))){
          x_1 = (Finger-1-(FPS*5));
          x_2 = (Finger-(FPS*5));

          x_1p = (Finger-1-(FPS*21));
          x_2p = (Finger-(FPS*21));
          
        }
  
        y_1 = Math.round(((RedAvFilt[x_1+FPS*4]*-30)+(240)));
        y_2 = Math.round(((RedAvFilt[x_2+FPS*4]*-30)+(240)));
        

        // Waveform
        ctxWave.beginPath();
        ctxWave.strokeStyle = "rgb(0, 140, 50)"; 
        ctxWave.lineWidth = 2.4; 
        ctxWave.lineJoin = "round";      
        ctxWave.moveTo(x_1p, y_1);    
        ctxWave.lineTo(x_2p, y_2);  
        ctxWave.stroke();

        // Peaks

        if (Finger <= (Math.round((21)*FPS))){
          for (k = 1; k < locs.length; k++){
            ctxWave.beginPath();
            ctxWave.strokeStyle = "rgb(255, 0, 0)"; 
            ctxWave.arc(locs[k]-(FPS*4),Math.round(((RedAvFilt[locs[k]]*-30)+(240))),5,0*Math.PI,2*Math.PI)
            ctxWave.stroke();

          }
        }
        else if (Finger > (Math.round((21)*FPS))){
          for (k = frameSwitch; k < locs.length; k++){
            ctxWave.beginPath();
            ctxWave.strokeStyle = "rgb(255, 0, 0)"; 
            ctxWave.arc(locs[k]-(FPS*20),Math.round(((RedAvFilt[locs[k]]*-30)+(240))),5,0*Math.PI,2*Math.PI)
            ctxWave.stroke();

          }

        }
        if (Finger == (Math.round((21)*FPS))){
          clearWave();
          frameSwitch = k-1;
        }
          
      }
    }
    
    // When Finished
    else if (Finger >= Math.round((37))*FPS){
      Fin = 1;
      loaderIcon.style.opacity = "0";
      doneIcon.style.opacity = "0";
      FeedbackColor.style.backgroundColor = 'rgba(70, 70, 70, 1)';
      RedAv = RedAv.slice(FPS*5,FPS*37);
      Feedback.innerHTML = "";
      Restart.style.opacity = "1";
      Restart.style.pointerEvents = "auto";
      
      // Fires done event to start signal processing
      const doneEvent = new Event('doneEvent');
      window.dispatchEvent(doneEvent);
    }

    
    else if (Finger >= Math.round((4)*FPS) && Finger<Math.round((5)*FPS)){
      Feedback.innerHTML = "1";
    }

    else if (Finger >= Math.round((3)*FPS) && Finger<Math.round((4)*FPS)){
      Feedback.innerHTML = "2";   
    }
    
    else if (Finger >= Math.round((2)*FPS) && Finger<Math.round((3)*FPS)){
      Feedback.innerHTML = "3";
      checkingIcon.style.opacity = "0";
      
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



// Start the Camera when the window loads [calls the first function up above]
window.addEventListener('load', cameraStart, false);

//Restart when the restart button is clicked
Restart.onclick = function(){
  clearWave();
  doneIcon.style.opacity = "0";
  Fin = 0; 
  Finger = 0; 

  Restart.style.opacity = "0";
  Restart.style.pointerEvents = "none";
}

//Switch Camera
switchButton.onclick = function(){
  if (toggle == 0){
    toggle = 1;
  }
  else if(toggle == 1){
    toggle = 0;
  }

  if (current == toggle){
  }
  else{
    if (toggle == 0){
      constraints = { video:{ 
        facingMode: "user",
        frameRate: { min: 30, ideal: 60 }, //Adjust ideal to 60 to increase max frame rate
        exposureMode: "none",
        whiteBalanceMode: "none",
      
        }, audio: false 
      };
      clearInterval(FrameRateSet);
      cameraStart();
      current = 0;
    }
    else if (toggle == 1){
      constraints = { video:{ 
        facingMode: "environment",
        frameRate: { min: 30, ideal: 60 }, //Adjust ideal to 60 to increase max frame rate
        exposureMode: "none",
        whiteBalanceMode: "none",
      
        }, audio: false 
      };
      clearInterval(FrameRateSet);
      cameraStart()
      current = 1;
    }

  }

}


// Animates the AFiD preloading screen before the main app
function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.1;
  }, 10);
}
window.addEventListener('load', function(){
  setTimeout(function(){fade(preLoad);}, 2400);

  preLoad.style.zindex = "0";

}, false);


// Takes user to the data display screen
dataButton.onclick = function(){
  window.location.href = 'dataScreen.html';
}

// Trigers the data processing afer collection
window.addEventListener("doneEvent",dataProcess, false);


function dataProcess() {

  locs.splice(0,4);
  var RR = [locs[1]-locs[0]];
  for (j = 2; j < locs.length; j++){
      RR.push(locs[j]-locs[j-1]);
  }
  var total = 0;
  for (k = 0; k < RR.length; k++){
      total += RR[k];
  }
  var HeartRate = Math.round(60 * FPS * RR.length / total);

  pulse_t = [0]; // pulse_t is an array of times of arrival of the pulses in milliseconds
	for (i = 0; i < locs.length; i++){
		pulse_t[i] = locs[i] * 1000 / FPS;
	}
	pulse_n = locs.length; // pulse_n is the number of pulse arrival times in the array.
	

  // Dr Linker's Algorithm
	function AFD(pulse_t,pulse_n){
		const theWin=7, theDivisor=28, theMax=Math.floor(pulse_n/theWin); // Currently set at values for a window of 7
		const aLoc = Math.floor(theWin/2);

		let inData = Array(pulse_n-1), rrs = Array(theWin), outData = Array(Math.floor((pulse_n-1)/theWin));
		let i, m, j, ave, val;



		i = 0;

		while (i < pulse_n - 1) { // n is the number of differences, which is -1 the number of values.

			inData[i] = 60000.0 / (pulse_t[i+1] - pulse_t[i]); //Convert to instantanious HR

			i++;

		}
		
		m = 0;

		j = 0;

		while (m < theMax) {

			for (i = 0; i < theWin; i++) { // Move data to buffer

				rrs[i] = inData[i+j];

			}




			ave = 0.0;

			for (i = 0; i < theWin; i++) { //Calculate the summ

				ave = ave + rrs[i];

			}




			ave = ave / theWin; // calculate the average

 

			for (i = 0; i < theWin; i++) { // Subtract it

				rrs[i] = rrs[i] - ave;

			}

 

			//add code for detrending for window of DTL 9/16/2005

			ave = 0.0;

			for (i = 0; i < theWin; i++) {

				ave = ave + rrs[i] * (aLoc-i);

			}

			ave = ave / theDivisor;


			for (i = 0; i < theWin; i++) {

				rrs[i] = rrs[i] + ave * (i-aLoc);

			}

 

			val = 0.0;

			for (i = 0; i < theWin; i++) {

				rrs[i] = Math.abs(rrs[i]);

			}




			rrs = rrs.sort(); // This replaces the bubble sort below


 

			outData[m++] = rrs[aLoc];




			j = j + theWin;

			;

		}

    

		outData = outData.sort();

		return (outData[Math.floor(theMax/2)] - 3.5); // where result is a number which indicates how likely this is AF, with numbers > 0 indicating likely, < 0 unlikely
	}
	AF = AFD(pulse_t,pulse_n);


  //Displays whether the rhythm is AF or NSR
  if (AF <=0 ){
    rhythm.innerHTML = "NSR";
  }
  else if (AF > 0){
    rhythm.innerHTML = "AF";

  }

  // Display Heart Rate
  HR.innerHTML = String(HeartRate).concat(' bpm');
  

  // Saves data to local stroage for the data screen
  var collectionNumber;
  collectionNumber = window.localStorage.getItem("Collection");
  console.log(collectionNumber);
  if (collectionNumber === null){
    window.localStorage.setItem("Collection", "0");
  }
  collectionNumber = window.localStorage.getItem("Collection");
  

  collectionNumber = parseInt(collectionNumber);
  collectionNumber = collectionNumber + 1;

  

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time+' HR='+String(Math.round(HeartRate));

  window.localStorage.setItem(String(collectionNumber), String(dateTime));
  window.localStorage.setItem("Collection", String(collectionNumber));

  downloadButton.disabled = false; // enable download button

  // exporting csv data
  downloadButton.onclick = function(){
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += RedAvFilt + "\r\n" + locs;
  
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_red.csv");
    document.body.appendChild(link);
    link.click();
  }
}

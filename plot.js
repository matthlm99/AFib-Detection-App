// Define constants
const dataPlot = document.querySelector("#data-plot");
var context = dataPlot.getContext('2d');
var wWidth;
var wHeight;
var pWidth;
var pHeight;
var height = 720;
var width = 1440;
var Cal = {1:'31',2:'28',3:'31',4:'30',5:'31',6:'30',7:'30',8:'31',9:'30',10:'31',11:'30',12:'31'};

function graphDraw(){
    
    dataPlot.height = height;
    dataPlot.width = width;
    Margin = 115;

    
    // Axes
    context.beginPath();
    context.strokeStyle = "rgb(60, 60, 60)"; 
    context.lineWidth = 10;   
    context.lineJoin = "round";      
    context.moveTo(Margin, Margin);    
    context.lineTo(Margin, height-Margin);  
    context.lineTo(width-(Margin*2), height-Margin);  
    context.stroke();

    //Y - Ticks
    context.beginPath();
    context.strokeStyle = "rgb(60, 60, 60)"; 
    context.lineWidth = 10;   
    context.lineJoin = "round"; 
    context.font = "50px Arial";
    context.textAlign = "center";
    
    for (i = 0; i <= 5; i++){     
        context.moveTo(Margin-20, Margin+(i*((height-(Margin*2))/6)));    
        context.lineTo(Margin+20, Margin+(i*((height-(Margin*2))/6)));
        var hearRateValue = 140 - (i*20);
        context.fillText(String(hearRateValue), 40, Margin+(i*((height-(Margin*2))/6))+20);  
    }
    context.stroke();

    //X - Ticks
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var day;
    // var dateTime = date+' '+time;
    // var currentDate = dateTime.slice(5, 9);

    context.beginPath();
    context.strokeStyle = "rgb(60, 60, 60)"; 
    context.lineWidth = 10;   
    context.lineJoin = "round"; 
    context.font = "50px Arial";
    context.textAlign = "center";
    context.fillText("Today", Margin+((width-(Margin*3))/14)+curr.getDay()*(width-(Margin*3))/7,Margin-10);
    context.font = "bold 50px Arial";
    context.fillText("bpm", Margin-60,Margin-40);
    context.font = "50px Arial";
    


    
    for (j = 0; j <= 6; j++){  
        i = 6-j;   
        context.moveTo(Margin+((width-(Margin*3))/14)+i*(width-(Margin*3))/7, height-Margin+20);    
        context.lineTo(Margin+((width-(Margin*3))/14)+i*(width-(Margin*3))/7, height-Margin-20);
        var dayCount = first + j; // last day is the first day + 6
        var currMonth = curr.getMonth()+1;
        var day = dayCount;

        if (day <= 0){
            currMonth = curr.getMonth();

            if (currMonth == 0){
                currMonth = 12
            }
            
            day = day + parseInt(Cal[String(currMonth)]);
            
        }

        if (["1","3","5","8","10","12"].indexOf(String(currMonth)) !== -1){
            if (day > 31){
                day = dayCount-31;
                currMonth = currMonth+1;
            }
            
        }
        else if (["4","6","7","9","11"].indexOf(String(currMonth)) !== -1){
            if (day > 30){
                day = dayCount-30;
                currMonth = currMonth+1;
            }
        }
        else if (["2"].indexOf(String(curr.getMonth()+1)) !== -1){
            if (day > 28){
                day = dayCount-28;
                currMonth = currMonth+1;
            }
        }
        //day = new Date(curr.setDate(dayCount)).toUTCString();
        //day = String(day).slice(5,8);

        context.fillText(String(currMonth)+"/"+String(day), Margin+((width-(Margin*3))/14)+j*(width-(Margin*3))/7, height-55); 
    }
    context.font = "bold 50px Arial";
    context.fillText("Date", Margin+((width-(Margin*3))/14)+3*(width-(Margin*3))/7, height-5);
    context.font = "50px Arial";
    context.stroke();
    
    


    roundRect(context, Margin, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.35)", 0)
    roundRect(context, Margin+1*(width-(Margin*3))/7, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.3)", 0)
    roundRect(context, Margin+2*(width-(Margin*3))/7, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.25)", 0)
    roundRect(context, Margin+3*(width-(Margin*3))/7, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.2)", 0)
    roundRect(context, Margin+4*(width-(Margin*3))/7, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.15)", 0)
    roundRect(context, Margin+5*(width-(Margin*3))/7, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.1)", 0)
    roundRect(context, Margin+6*(width-(Margin*3))/7, Margin, (width-(Margin*3))/7, (height-(Margin*2)), 10, "rgba(60, 60, 60,0.05)", 0)
    
    dataParse(context);
    
    
};

function Orientation(){
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

    if (wWidth<wHeight){
        dataPlot.style.height = String(wWidth/2)+"px";
        dataPlot.style.width = String((wWidth/1.02)-10)+"px";
    }
    else if (wWidth > wHeight){
        dataPlot.style.height = String(wHeight/2)+"px";
        dataPlot.style.width = String((wWidth/1.25)-165)+"px";
    }
  

};

window.addEventListener('load', graphDraw, false);


setInterval(Orientation, ((1/30)*1000));

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  
}

function dataParse(ctx){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay();
    var cMonth = curr.getMonth()+1;
    var cDay
    var collectionNumber = parseInt(window.localStorage.getItem("Collection"));
    var latestData;
    var dDay;
    var dMonth;
    var Rate;
    
    

    for (k = 1; k <= collectionNumber; k++){
        latestData = window.localStorage.getItem(String(k));
        dDay = parseInt(latestData.slice(7,9));
        dMonth = parseInt(latestData.slice(5,6));
        
        

        if (dMonth==cMonth){
            if ([first,first+1,first+2,first+3,first+4,first+5,first+6].indexOf(dDay) !== -1){

        
                //drawHeart(ctx, fromx, fromy, tox, toy,lw,hlen,color)
                var range = (height-(2*Margin));
                if(latestData.slice(21,22)=="="){
                    Rate = parseInt(latestData.slice(22,24));
                }
                else{
                    Rate = parseInt(latestData.slice(21,24));
                }


                latestData.slice(21,24)
                var HR = ((140-Rate)/(140-20));
                console.log(String(HR));

                
                var xLoc = Margin+((width-(Margin*3))/14)+(dDay - first)*(width-(Margin*3))/7;


                drawHeart(ctx, xLoc, (80 + (HR*range)), xLoc, ((HR*range)+Margin),80,80,"rgb(255, 190, 240)")


            }
        }
    
    }   
    

    
}

function drawHeart(ctx, fromx, fromy, tox, toy,lw,hlen,color) {

    var x = fromx;
    var y = fromy;
    var width = lw ;
    var height = hlen;
  
    ctx.save();
    ctx.beginPath();
    var topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
      x, y, 
      x - width / 2, y, 
      x - width / 2, y + topCurveHeight
    );
  
    // bottom left curve
    ctx.bezierCurveTo(
      x - width / 2, y + (height + topCurveHeight) / 2, 
      x, y + (height + topCurveHeight) / 2, 
      x, y + height
    );
  
    // bottom right curve
    ctx.bezierCurveTo(
      x, y + (height + topCurveHeight) / 2, 
      x + width / 2, y + (height + topCurveHeight) / 2, 
      x + width / 2, y + topCurveHeight
    );
  
    // top right curve
    ctx.bezierCurveTo(
      x + width / 2, y, 
      x, y, 
      x, y + topCurveHeight
    );
  
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgb(60, 60, 60)"; 
    ctx.lineWidth = 5;   
    ctx.stroke();
    ctx.restore();
  
  }


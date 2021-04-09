// This javascript code controls the locking and scrolling mechanism of the app

// ----- Main Method -----
// Access relevant elements and compute dimensions
var content_screen = document.querySelector(".content-wrapper");
var video_processor = document.querySelector(".video-processor");
var portfolio_wrapper = document.querySelector(".portfolio-wrapper");
var header_element = document.querySelector(".header");
console.log(content_screen.screenX);

// Calculate screen dimensions
var content_width = content_screen.scrollWidth,
    content_height = content_screen.scrollHeight;

const midScreen_positionX = video_processor.clientWidth / 2,
    videoProcessor_positionX = 0,
    portfolioWrapper_positionX = video_processor.clientWidth;

window.addEventListener('touchend', ()=>{
    screenLock(videoProcessor_positionX, portfolioWrapper_positionX);
})

// Function for locking screen
function screenLock(videoProcessor_positionX, portfolioWrapper_positionX){
    content_screen.scrollTo(portfolioWrapper_positionX, 5);
    if (content_screen.screenX > midScreen_positionX){
        content_screen.scrollTo(portfolioWrapper_positionX, 5);
    } else if (content_screen.screenX < midScreen_positionX){
        content_screen.scrollTo(videoProcessor_positionX, 5);
    } 
}

// This script allows for the image to be darkened when it is hovered on


const portfolioItems = document.querySelectorAll('.portfolio-img-bg');

portfolioItems.foreach(portfolioItem => {
    portfolioItem.addEventListener('mouseover', () => {
        console.log(portfolioItem.childNodes[1].classList);
        portfolioItem.childNodes[1].classList.add('.img-darken');
    })
    portfolioItem.addEventListener('mouseout', () => {
        console.log(portfolioItem.childNodes[1].classList);
        portfolioItem.childNodes[1].classList.remove('.img-darken');
    })
})
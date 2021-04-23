// Control load icon animation and visibility
var loader_object = document.getElementById('heartbeat-loader')
loader_object.style.visibility = 'hidden';
function loaderToggle(load_icon_object){
    if (load_icon_object.style.visibility == 'visible'){
        load_icon_object.style.visibility = 'hidden';
    } else if (load_icon_object.style.visibility == 'hidden'){
        load_icon_object.style.visibility = 'visible';
    }
}
setInterval(() => {
    loaderToggle(loader_object);
}, 1500);
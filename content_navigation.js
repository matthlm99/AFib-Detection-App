const _C = document.querySelector('.content-wrapper'),
    N = _C.children.length;

_C.style.setProperty('--n', N);
function unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e
};
let x0 = null;
let i = 0;
function move(e) {
    if(x0 || x0 === 0) {
        let dx = unify(e).clientX - x0, s = Math.sign(dx);
      
        if((i > 0 || s < 0) && (i < N - 1 || s > 0))
          _C.style.setProperty('--i', i -= s);
        
        x0 = null
      }
}
function lock(e) {
    x0 = unify(e).clientX;
}
_C.addEventListener('mousedown', lock, false);
_C.addEventListener('touchstart', lock, false);
_C.addEventListener('mouseup', move, false);
_C.addEventListener('touchend', move, false);

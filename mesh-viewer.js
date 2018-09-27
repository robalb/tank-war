'use strict';
document.addEventListener('DOMContentLoaded',glCheck);
window.addEventListener('resize',resize);
var canvas = null;
var glContext = null;
function glCheck(){
    //
    //get the canvas and the glContext in the meantime im checking if the browser support the gl graphics...
    //
    canvas = document.getElementById('glContext');
    glContext = canvas.getContext('webgl');
    glContext = canvas.getContext('experimental-webgl');
    //
    //if he does, continue to the setup
    //
    if(glContext){
        setup();
    }
    //
    //else alert
    //
    else{
        alert('your browser do not support webgl!!');
    }
} 
function setup(){
    
}
function resize(){
    //
    //setting the new widht/height of the canvas, and saying that the viewport of the glContext, must be equal to the drawing buffer 'capacity'(it means that you can have more accurate lines even if the window is very small[or at leas this is how i ve understood it])
    //
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    glContext.viewport(0.0,0.0,glContext.drawingBufferWidth,glContext.drawingBufferHeight);
    alert(0);
}
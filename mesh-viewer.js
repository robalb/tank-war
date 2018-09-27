'use strict';
document.addEventListener('DOMContentLoaded',glCheck);
window.addEventListener('resize',resize);
var canvas = null;
var glContext = null;
function glCheck(){
    canvas = document.getElementById('glContext');
    glContext = canvas.getContext('webgl');
    glContext = canvas.getContext('experimental-webgl');
    if(glContext){
        setup();
    }
    else{
        alert('your browser do not support webgl!!');
    }
} 
function setup(){
    
}
function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    glContext.viewport(0.0,0.0,glContext.drawingBufferWidth,glContext.drawingBufferHeight);
    alert(0);
}
'use strict';
document.addEventListener('DOMContentLoaded',function(){
        loadResource('./shaders/vertshader.glsl',function(VS_Err,VS_text){if(VS_Err != null){console.log(VS_Err);}
                                                     else{
                                                         loadResource('./shaders/fragshader.glsl',function(FS_Err,FS_text){
                                                             if(FS_Err != null){conosle.log(FS_Err);}
                                                             else{
                                                                glCheck(VS_text,FS_text);
                                                             }
                                                         });
                                                     }
                                                    });
    });
window.addEventListener('resize',resize);
window.addEventListener('mousemove',function(pos){
    if(mouseDown){
        rotate(pos);
    }
});
window.addEventListener('mousedown',
function(pos){
    mouseDown = true;                                                  
    xMousePos = pos.clientX;
    yMousePos = pos.clientY;
});
window.addEventListener('mouseup',function(){mouseDown = false;});
//
//
//VARIABLES ALLOCATION
//
//

//
//mouse variables
//
var xMouseAngle = 1000;
var yMouseAngle = 1000;
var xMousePos = 0;
var yMousePos = 0;
//
//rest of the variables
//
var mouseDown = false;
var canvas = null;
var glContext = null;
var vertexShader = null;
var fragmentShader = null;
var vertexPositionAttribLoc = null;
var vertexColorAttribLoc = null;
var positionBuffer = null;
var indexBuffer = null;
//
//allocating the float32 format arrays for the matrixes
//
var worldMat = new Float32Array(16);
var worldMatLoc = null;
var viewMat = new Float32Array(16);
var viewMatLoc = null;
var projectionMat = new Float32Array(16);
var projectionMatLoc = null;
var emptyMat = new Float32Array(16);
var xRotationMat = new Float32Array(16);
var yRotationMat = new Float32Array(16);
var glProgram = null;
//
//
//INDEXES AND POSITIONS
//
//
var vertexesPositions = 
[//   X ,  Y ,  Z ,     R ,  G ,  B ,  A
      -0.5 ,  0.5 ,  0.5 ,    1.0, 1.0, 0.0, 1.0, //0
      -0.5 ,  0.5 ,  -0.5 ,    1.0, 0.0, 1.0, 1.0, //1
      0.5 ,  0.5 ,  0.5 ,    1.0, 1.0, 1.0, 1.0, //2
      0.5 ,  0.5 ,  -0.5 ,    0.0, 1.0, 0.0, 1.0, //3
      -0.5 ,  -0.5 ,  0.5 ,    0.0, 1.0, 1.0, 1.0, //4
      -0.5 ,  -0.5 ,  -0.5 ,    0.5, 0.5, 0.0, 1.0, //5
      0.5 ,  -0.5 ,  0.5 ,    1.0, 0.5, 0.5, 1.0, //6
      0.5 ,  -0.5 ,  -0.5 ,    1.0, 0.0, 0.5, 1.0, //7
];
var vertexesIndexes = 
[
    //triangle
    0,3,1,
    0,3,2,
    0,5,1,
    0,5,4,
    0,6,4,
    0,6,2,
    7,4,5,
    7,4,6,
    7,2,6,
    7,2,3,
    7,1,3,
    7,1,5
];
//
//
//FUNCTIONS
//
//
function glCheck(vertShader,fragShader){
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
        //
        //declaring the value of previous null variables
        //
        vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
        fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);
        positionBuffer = glContext.createBuffer();
        indexBuffer = glContext.createBuffer();
        glProgram = glContext.createProgram();
        //
        //giving the source to the shaders
        //
        glContext.shaderSource(vertexShader,vertShader);
        glContext.shaderSource(fragmentShader,fragShader);
        setup();
    }
    //
    //else alert
    //
    else{
        alert('your browser do not support webgl!!');
    }
} 
function resize(){
    //
    //setting the new widht/height of the canvas, and saying that the viewport of the glContext, must be equal to the drawing buffer 'capacity'(it means that you can have more accurate lines even if the window is very small[or at leas this is how i ve understood it])
    //
    canvas.width = window.innerWidth-10;
    canvas.height = window.innerHeight-10;
    glContext.viewport(0.0,0.0,glContext.drawingBufferWidth,glContext.drawingBufferHeight);
    console.log('resize ended without errors');
}
function rotate(pos){
    //
    //rotating the triangle when the mouse button is down
    //
    xMouseAngle += xMousePos - pos.clientX;
    xMousePos = pos.clientX;
    yMouseAngle -= yMousePos - pos.clientY;
    yMousePos = pos.clientY;
    mat4.rotate(yRotationMat,emptyMat,xMouseAngle/100,[0,1,0]);
    mat4.rotate(xRotationMat,emptyMat,-yMouseAngle/100,[1,0,0]);
    mat4.mul(worldMat,xRotationMat,yRotationMat);
    glContext.uniformMatrix4fv(worldMatLoc,glContext.FALSE,worldMat);
}
function setup(){
    resize();
    //
    //compiling and attaching the shaders to the program
    //
    glContext.compileShader(vertexShader);
    glContext.compileShader(fragmentShader);
    glContext.attachShader(glProgram, vertexShader);
    glContext.attachShader(glProgram, fragmentShader);
    //
    //passing the program to the gpu (?) im not sure about what happening when you link the program... because its not an alias of use this or that program... this one you will see later
    //
    glContext.linkProgram(glProgram);
    glContext.validateProgram(glProgram);
    //           |
    //right here V im saying that the gpu must use this program... so i m not sure about the prev 2 code lines...
    //
    glContext.useProgram(glProgram);
    //
    //getting the attributes and matrixes(uniforms positions)
    //
    vertexColorAttribLoc = glContext.getAttribLocation(glProgram,'vertColor');
    vertexPositionAttribLoc = glContext.getAttribLocation(glProgram,'vertPosition');
    worldMatLoc = glContext.getUniformLocation(glProgram,'worldMat');
    viewMatLoc = glContext.getUniformLocation(glProgram,'viewMat');
    projectionMatLoc = glContext.getUniformLocation(glProgram,'projectionMat');
    //
    //filling the matrixes
    //
    mat4.identity(worldMat);
    mat4.lookAt(viewMat,[0.0,0.0,-5.0],[0.0,0.0,0.0],[0,1,0]);
    mat4.perspective(projectionMat, glMatrix.toRadian(45),canvas.width/canvas.height, 0.1,1000.0);
    mat4.identity(emptyMat);
    //
    //binding the matrixes values to thems locations 
    //
    glContext.uniformMatrix4fv(worldMatLoc,glContext.FALSE,worldMat);
    glContext.uniformMatrix4fv(viewMatLoc,glContext.FALSE,viewMat);
    glContext.uniformMatrix4fv(projectionMatLoc,glContext.FALSE,projectionMat);
    //
    //binding the data buffers to the program
    //
    glContext.bindBuffer(glContext.ARRAY_BUFFER,positionBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER,new Float32Array(vertexesPositions),glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexesIndexes),glContext.STATIC_DRAW);
    //
    //now estabilishing the pattern to use to get the data from the buffers...
    //
    glContext.vertexAttribPointer(
        vertexPositionAttribLoc,            //the attrib location inside the fragment
        3,                                  //amount of elements to take from the array
        glContext.FLOAT,                    //type of the data that the gpu will process
        glContext.FALSE,                    //normalization pararmeter for now will be false
        7*Float32Array.BYTES_PER_ELEMENT,   //full size of the vertex including the colors in bytes
        0                                   //the element offset
    );
    glContext.vertexAttribPointer(
        vertexColorAttribLoc,
        4,
        glContext.FLOAT,
        glContext.FALSE,
        7*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT    //this time i have an offset of 3 elements because i want to take only the color data and the size of the offset must be in bytes too (check the architecture of the array above in the INDEXES AND POSITIONS section)
    );
    //
    //now its the moment to enable our vertAttribPointers:          (PA: you must always give to the gpu a program before enabling the pointers )
    //
    glContext.enableVertexAttribArray(vertexPositionAttribLoc);
    glContext.enableVertexAttribArray(vertexColorAttribLoc);
    //
    //if we re already here i think i should put this too
    //
    glContext.enable(glContext.DEPTH_TEST); // the function that care about the z index of each vertex and show or hide stuff in base of him
    
    glContext.clearColor(0.0,0.0,0.0,1.0);
    glContext.clear(glContext.DEPTH_BUFFER_BIT | glContext.COLOR_BUFFER_BIT);
    loop();
}
function loadResource(url,callback){
    let requestResource = new XMLHttpRequest();
    requestResource.open('GET', url, true);
    requestResource.onload= function () {
        if(requestResource.status < 200 || requestResource.status > 299){
            callback('Error: HTTP Status:'+requestResource.status+' on resource :'+url,null);
        }
        else{
            callback(null,requestResource.responseText);
        }
    }
    requestResource.send();
}
function loop(){
    glContext.clear(glContext.DEPTH_BUFFER_BIT | glContext.COLOR_BUFFER_BIT);
    glContext.drawElements(glContext.TRIANGLES,vertexesIndexes.length,glContext.UNSIGNED_SHORT,0);
    console.log('girogiro');
    window.requestAnimationFrame(loop);
}
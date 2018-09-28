precision mediump float;
attribute vec3 vertPosition;
attribute vec4 vertColor;
varying vec4 vertexColor;
uniform mat4 worldMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;
void main(){
    vertexColor = vertColor;
    gl_Position = projectionMat * viewMat * worldMat * vec4(vertPosition , 1.0);
}
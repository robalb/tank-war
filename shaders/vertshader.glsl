precision mediump float;
attribute vec3 vertPosition;
attribute vec3 normalVertPosition;
attribute vec4 vertColor;
varying vec3 normalFragColor;
varying vec4 vertexColor;
uniform mat4 worldMat;
uniform mat4 viewMat;
uniform mat4 projectionMat;
void main(){
    vertexColor = vertColor;
    normalFragColor = (worldMat * normalize(vec4(normalVertPosition,0.0))).xyz;
    gl_Position = projectionMat * viewMat * worldMat * vec4(vertPosition , 1.0);
}
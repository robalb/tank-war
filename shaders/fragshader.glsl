precision mediump float;
varying vec3 normalFragColor;
varying vec4 vertexColor;
void main (){
    vec3 ambientLightIntensity = vec3(0.1,0.1,0.2);
    vec3 sunlightIntensity = vec3(1.0,1.0,1.0);
    vec3 sunlightDirection = normalize(vec3(-40.0,10.0,-30.0));
    vec3 lightIntensity = ambientLightIntensity + (sunlightIntensity * max(dot(normalFragColor, sunlightDirection),0.0));
    gl_FragColor =normalize(vec4(lightIntensity,1.0)*vertexColor);
}
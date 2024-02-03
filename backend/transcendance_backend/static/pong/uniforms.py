var vertexShader = `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;


var fragmentShader = `
    varying vec2 vUv;
    uniform float thickness;
    uniform vec3 color;
    varying vec3 instanceColor;

    float edgeFactor(vec2 p){
        vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
        return min(grid.x, grid.y);
    }

    void main() {
        float a = clamp(edgeFactor(vUv), 0., 1.);
        vec3 redColor = vec3(1.0, 0.0, 0.0); // Red color
        vec3 whiteColor = vec3(0, 0, 0); // White color

        vec3 finalColor = mix(whiteColor, redColor, a);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

var TEST = new THREE.ShaderMaterial({
    uniforms: {
      thickness: {
          value: 1.5
      },
      color: {
          value: new THREE.Color()
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: {derivatives: true}
  });
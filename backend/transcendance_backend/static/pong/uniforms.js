
import * as THREE from 'three';

export const vertexShader = `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;


export const fragmentShader = `
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
        vec3 blackColor = vec3(0, 0, 0); // black color

        vec3 finalColor = mix(blackColor, redColor, a);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;


export const fragmentShader_blue = `
    varying vec2 vUv;
    uniform float thickness;
    uniform vec3 color;
    varying vec3 instanceColor;

    float edgeFactor(vec2 p){
        vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
        return min(grid.x, grid.y);
    }

    vec3 hexToVec3(int hex) {
        float r = float((hex >> 16) & 0xFF) / 255.0;
        float g = float((hex >> 8) & 0xFF) / 255.0;
        float b = float(hex & 0xFF) / 255.0;
        return vec3(r, g, b);
    }

    void main() {
        float a = clamp(edgeFactor(vUv), 0., 1.);
        vec3 blueColor = hexToVec3(0x00fff7); // Blue color
        vec3 blackColor = vec3(0, 0, 0); // Black color

        vec3 finalColor = mix(blackColor, blueColor, a);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;



export const uniform_red = new THREE.ShaderMaterial({
    uniforms: {
      thickness: {
          value: 1.8
      },
      color: {
          value: new THREE.Color()
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: {derivatives: true}
  });


  export const uniform_blue = new THREE.ShaderMaterial({
    uniforms: {
      thickness: {
          value: 1.8
      },
      color: {
          value: new THREE.Color()
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader_blue,
    extensions: {derivatives: true}
  });
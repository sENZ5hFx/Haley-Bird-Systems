import { Effect, BlendFunction } from 'postprocessing';
import { Uniform } from 'three';

const fragmentShader = `
  uniform float focusDistance;
  uniform float focalLength;
  uniform float maxBlur;
  uniform float aperture;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    
    float focus = smoothstep(focusDistance - focalLength, focusDistance, dist) * 
                  smoothstep(focusDistance + focalLength, focusDistance, dist);
    focus = 1.0 - focus;
    
    float blur = focus * maxBlur * aperture;
    
    vec4 color = vec4(0.0);
    float total = 0.0;
    
    for (float x = -2.0; x <= 2.0; x += 1.0) {
      for (float y = -2.0; y <= 2.0; y += 1.0) {
        vec2 offset = vec2(x, y) * blur * 0.01;
        color += texture2D(inputBuffer, uv + offset);
        total += 1.0;
      }
    }
    
    outputColor = color / total;
  }
`;

export class DepthOfFieldEffect extends Effect {
  constructor({
    focusDistance = 0.5,
    focalLength = 0.2,
    maxBlur = 1.0,
    aperture = 1.0
  } = {}) {
    super('DepthOfFieldEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['focusDistance', new Uniform(focusDistance)],
        ['focalLength', new Uniform(focalLength)],
        ['maxBlur', new Uniform(maxBlur)],
        ['aperture', new Uniform(aperture)]
      ])
    });
  }

  set focusDistance(value: number) {
    (this.uniforms.get('focusDistance') as Uniform<number>).value = value;
  }

  set aperture(value: number) {
    (this.uniforms.get('aperture') as Uniform<number>).value = value;
  }
}

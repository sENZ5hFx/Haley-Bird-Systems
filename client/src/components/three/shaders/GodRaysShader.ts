import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

const fragmentShader = `
  uniform vec2 lightPosition;
  uniform float exposure;
  uniform float decay;
  uniform float density;
  uniform float weight;
  uniform int samples;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 deltaTextCoord = uv - lightPosition;
    deltaTextCoord *= 1.0 / float(samples) * density;
    
    vec2 coord = uv;
    vec4 color = inputColor;
    float illuminationDecay = 1.0;
    
    for (int i = 0; i < 100; i++) {
      if (i >= samples) break;
      coord -= deltaTextCoord;
      vec4 sample = texture2D(inputBuffer, coord);
      sample *= illuminationDecay * weight;
      color += sample;
      illuminationDecay *= decay;
    }
    
    outputColor = color * exposure;
  }
`;

export class GodRaysEffect extends Effect {
  constructor({
    lightPosition = new Vector2(0.5, 0.5),
    exposure = 0.34,
    decay = 0.95,
    density = 0.96,
    weight = 0.4,
    samples = 60
  } = {}) {
    super('GodRaysEffect', fragmentShader, {
      blendFunction: BlendFunction.ADD,
      uniforms: new Map([
        ['lightPosition', new Uniform(lightPosition)],
        ['exposure', new Uniform(exposure)],
        ['decay', new Uniform(decay)],
        ['density', new Uniform(density)],
        ['weight', new Uniform(weight)],
        ['samples', new Uniform(samples)]
      ])
    });
  }

  set lightPosition(value: Vector2) {
    (this.uniforms.get('lightPosition') as Uniform<Vector2>).value = value;
  }

  get lightPosition(): Vector2 {
    return (this.uniforms.get('lightPosition') as Uniform<Vector2>).value;
  }
}

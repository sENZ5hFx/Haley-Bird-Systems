import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Vector2 } from 'three';

const fragmentShader = `
  uniform vec2 offset;
  uniform float intensity;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 direction = uv - 0.5;
    float dist = length(direction);
    vec2 aberrationOffset = offset * dist * intensity;
    
    float r = texture2D(inputBuffer, uv + aberrationOffset).r;
    float g = texture2D(inputBuffer, uv).g;
    float b = texture2D(inputBuffer, uv - aberrationOffset).b;
    
    outputColor = vec4(r, g, b, inputColor.a);
  }
`;

export class ChromaticAberrationEffect extends Effect {
  constructor({
    offset = new Vector2(0.002, 0.002),
    intensity = 1.0
  } = {}) {
    super('ChromaticAberrationEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['offset', new Uniform(offset)],
        ['intensity', new Uniform(intensity)]
      ])
    });
  }

  set intensity(value: number) {
    (this.uniforms.get('intensity') as Uniform<number>).value = value;
  }

  get intensity(): number {
    return (this.uniforms.get('intensity') as Uniform<number>).value;
  }
}

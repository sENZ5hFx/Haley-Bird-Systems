import { Effect, BlendFunction } from 'postprocessing';
import { Uniform } from 'three';

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform float speed;
  
  float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float noise = random(uv + time * speed) * 2.0 - 1.0;
    vec3 grain = vec3(noise) * intensity;
    
    float luminance = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
    float grainAmount = 1.0 - luminance * 0.5;
    
    vec3 color = inputColor.rgb + grain * grainAmount;
    outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
  }
`;

export class FilmGrainEffect extends Effect {
  constructor({
    intensity = 0.05,
    speed = 1.0
  } = {}) {
    super('FilmGrainEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['time', new Uniform(0)],
        ['intensity', new Uniform(intensity)],
        ['speed', new Uniform(speed)]
      ])
    });
  }

  update(_renderer: unknown, _inputBuffer: unknown, deltaTime: number) {
    const time = this.uniforms.get('time') as Uniform<number>;
    time.value += deltaTime;
  }

  set intensity(value: number) {
    (this.uniforms.get('intensity') as Uniform<number>).value = value;
  }
}

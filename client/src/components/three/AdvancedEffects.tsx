import { forwardRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Effect } from 'postprocessing';
import { Vector2, Uniform } from 'three';
import { useExperience } from '@/lib/stores/useExperience';

const godRaysFragment = `
  uniform vec2 lightPosition;
  uniform float exposure;
  uniform float decay;
  uniform float density;
  uniform float weight;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 deltaTextCoord = uv - lightPosition;
    deltaTextCoord *= 0.016 * density;
    
    vec2 coord = uv;
    vec4 color = inputColor;
    float illuminationDecay = 1.0;
    
    for (int i = 0; i < 60; i++) {
      coord -= deltaTextCoord;
      vec4 sampleColor = texture2D(inputBuffer, coord);
      sampleColor *= illuminationDecay * weight;
      color += sampleColor;
      illuminationDecay *= decay;
    }
    
    outputColor = color * exposure;
  }
`;

class GodRaysEffectImpl extends Effect {
  constructor() {
    super('GodRaysEffect', godRaysFragment, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['lightPosition', new Uniform(new Vector2(0.5, 0.3))],
        ['exposure', new Uniform(0.2)],
        ['decay', new Uniform(0.96)],
        ['density', new Uniform(0.8)],
        ['weight', new Uniform(0.3)]
      ])
    });
  }
}

const chromaticFragment = `
  uniform float intensity;
  uniform float time;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 direction = uv - 0.5;
    float dist = length(direction);
    float aberration = dist * intensity * 0.003 * (1.0 + sin(time * 0.5) * 0.2);
    
    float r = texture2D(inputBuffer, uv + direction * aberration).r;
    float g = texture2D(inputBuffer, uv).g;
    float b = texture2D(inputBuffer, uv - direction * aberration).b;
    
    outputColor = vec4(r, g, b, inputColor.a);
  }
`;

class ChromaticEffectImpl extends Effect {
  constructor() {
    super('ChromaticEffect', chromaticFragment, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['intensity', new Uniform(0.5)],
        ['time', new Uniform(0)]
      ])
    });
  }
}

const filmGrainFragment = `
  uniform float time;
  uniform float intensity;
  
  float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float noise = random(uv + fract(time)) * 2.0 - 1.0;
    float luminance = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
    float grainAmount = (1.0 - luminance * 0.5) * intensity;
    
    vec3 color = inputColor.rgb + vec3(noise) * grainAmount;
    outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
  }
`;

class FilmGrainEffectImpl extends Effect {
  constructor() {
    super('FilmGrainEffect', filmGrainFragment, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['time', new Uniform(0)],
        ['intensity', new Uniform(0.04)]
      ])
    });
  }
}

export const GodRays = forwardRef<GodRaysEffectImpl>(function GodRays(_, ref) {
  const effect = useMemo(() => new GodRaysEffectImpl(), []);
  const getState = useExperience.getState;
  
  useFrame((state) => {
    const { mousePosition } = getState();
    const lightPos = effect.uniforms.get('lightPosition');
    if (lightPos) {
      const targetX = 0.5 + mousePosition.x * 0.3;
      const targetY = 0.3 + mousePosition.y * 0.2;
      lightPos.value.x += (targetX - lightPos.value.x) * 0.05;
      lightPos.value.y += (targetY - lightPos.value.y) * 0.05;
    }
  });
  
  useEffect(() => {
    return () => effect.dispose();
  }, [effect]);
  
  return <primitive ref={ref} object={effect} />;
});

export const ChromaticAberration = forwardRef<ChromaticEffectImpl>(function ChromaticAberration(_, ref) {
  const effect = useMemo(() => new ChromaticEffectImpl(), []);
  const getState = useExperience.getState;
  
  useFrame((state) => {
    const { scrollProgress } = getState();
    const time = effect.uniforms.get('time');
    const intensity = effect.uniforms.get('intensity');
    if (time) time.value = state.clock.getElapsedTime();
    if (intensity) intensity.value = 0.3 + scrollProgress * 0.5;
  });
  
  useEffect(() => {
    return () => effect.dispose();
  }, [effect]);
  
  return <primitive ref={ref} object={effect} />;
});

export const FilmGrain = forwardRef<FilmGrainEffectImpl>(function FilmGrain(_, ref) {
  const effect = useMemo(() => new FilmGrainEffectImpl(), []);
  
  useFrame((state) => {
    const time = effect.uniforms.get('time');
    if (time) time.value = state.clock.getElapsedTime();
  });
  
  useEffect(() => {
    return () => effect.dispose();
  }, [effect]);
  
  return <primitive ref={ref} object={effect} />;
});

// Detect device capability for adaptive quality settings
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export interface DeviceCapability {
  isMobile: boolean;
  isLowPower: boolean;
  isHighEndGPU: boolean;
  memoryAvailable: number;
  effectiveConnectionType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
}

export function detectDeviceCapability(): DeviceCapability {
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Battery status / Low Power mode
  let isLowPower = false;
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      isLowPower = battery.level < 0.2 && battery.charging === false;
    });
  }

  // Check for Low Power Mode on iOS
  const navWithMemory = navigator as NavigatorWithMemory;
  if (navWithMemory.deviceMemory) {
    isLowPower = isLowPower || navWithMemory.deviceMemory <= 4;
  }

  // Memory estimate
  const memoryAvailable = navWithMemory.deviceMemory || 8;
  isLowPower = isLowPower || memoryAvailable <= 4;

  // Connection type
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const effectiveConnectionType = (connection?.effectiveType || '4g') as any;

  // GPU detection (high-end GPU likely on desktop with discrete graphics)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
  const renderer = gl?.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL as any) || '';
  
  const isHighEndGPU = /RTX|RTX|NVIDIA|Radeon RX|GeForce GTX|GeForce RTX/i.test(renderer as string) || 
                       memoryAvailable >= 16;

  return {
    isMobile,
    isLowPower,
    isHighEndGPU,
    memoryAvailable,
    effectiveConnectionType
  };
}

export function getQualitySettings(capability: DeviceCapability) {
  if (capability.isMobile || capability.isLowPower) {
    return {
      particleCount: 1000,
      particleSize: 0.012,
      postProcessing: 'low',
      shadowMapSize: 512,
      textureQuality: 'low'
    };
  }

  if (capability.isHighEndGPU) {
    return {
      particleCount: 5000,
      particleSize: 0.015,
      postProcessing: 'high',
      shadowMapSize: 2048,
      textureQuality: 'high'
    };
  }

  // Default for mid-range
  return {
    particleCount: 3000,
    particleSize: 0.015,
    postProcessing: 'medium',
    shadowMapSize: 1024,
    textureQuality: 'medium'
  };
}

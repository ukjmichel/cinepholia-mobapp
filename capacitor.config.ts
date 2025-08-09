import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'cinepholia-mobapp',
  webDir: 'www',
  server: {
    // Allow navigation to external URLs (your Node.js API)
    allowNavigation: [
      'http://localhost:*',
      'https://localhost:*',
      'http://10.0.2.2:*', // Android emulator
      'http://192.168.*:*', // Common local network range
      'http://172.16.*:*', // Another common local network range
    ],
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  // For Android specific settings
  android: {
    allowMixedContent: true,
    captureInput: true,
  },
  // For iOS specific settings
  ios: {
    contentInset: 'automatic',
  },
};

export default config;

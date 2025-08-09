
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.getPlatform() !== 'web';
const host = isNative ? 'http://10.0.2.2:3000/' : 'http://localhost:3000/';

export const environment = {
  production: false,
  apiUrl: host,
  apiBaseUrl: host,
};

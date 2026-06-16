import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mightyunits.hammerandbricks',
  appName: 'Hammer & Bricks',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#0a0a2e',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#0a0a2e'
  },
  android: {
    backgroundColor: '#0a0a2e',
    allowMixedContent: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#0a0a2e',
      showSpinner: false,
      androidSplashResourceName: 'splash'
    }
  }
};

export default config;

declare module 'next-pwa' {
  import { NextConfig } from 'next';
  import { PWAConfig } from 'next-pwa';

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}

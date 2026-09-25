import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.31.78','172.20.10.2','192.168.1.10','192.168.1.89',
    '192.168.1.160','192.168.1.186','192.168.1.195','192.168.1.206',
    '192.168.1.103','192.168.1.87','192.168.0.194','10.126.94.234',
    '192.168.1.184','192.168.1.240','192.168.1.5','192.168.1.212','192.168.0.97','192.168.1.114','192.168.0.184','192.168.1.116'
  ],
  // public/ files default to `max-age=0`, so every visit re-downloaded the
  // site's images and videos. Cache them for a day, then keep serving the
  // cached copy while revalidating in the background for a further week.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return ["/images/:path*", "/videos/:path*", "/video/:path*", "/icons/:path*", "/logo-source.png"].map((source) => ({
      source,
      headers: cache,
    }));
  },
};

export default nextConfig;

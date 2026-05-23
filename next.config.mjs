// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   disable: process.env.NODE_ENV === "development",
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// });

// const isDev = process.env.NODE_ENV === "development";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "ra.tglevels.in",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "app.tglevels.in",
//         pathname: "/**",
//       },
//     ],
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://app.tglevels.in/:path*",
//       },
//     ];
//   },

// // async headers() {
// //   return [
// //     {
// //       source: "/(.*)",
// //       headers: [
// //         {
// //           key: "Content-Security-Policy",
// //           value: `
// //             default-src 'self';

// //             script-src 'self' 'unsafe-inline' ${
// //               isDev ? "'unsafe-eval'" : ""
// //             } https://tglevels.org;

// //             style-src 'self' 'unsafe-inline'
// //               https://tglevels.org;

// //             style-src-elem 'self' 'unsafe-inline'
// //               https://tglevels.org;

// //             img-src 'self' data: blob:
// //               https://tglevels.org
// //               https://ra.tglevels.in
// //               https://app.tglevels.in;

// //             media-src 'self'
// //               https://tglevels.org;

// //             font-src 'self' data:
// //               https://tglevels.org;

// //             connect-src 'self'
// //               https://tglevels.org
// //               https://app.tglevels.in
// //               wss:
// //               ws:;

// //             frame-src 'self'
// //               https://tglevels.org;
// //           `
// //             .replace(/\n/g, " ")
// //             .trim(),
// //         },
// //       ],
// //     },
// //   ];
// // }
// };

// export default withPWA(nextConfig);
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  customWorkerSrc: "worker",
  workboxOptions: {
    disableDevLogs: true,
    exclude: [
      /_buildManifest\.js$/,
      /_ssgManifest\.js$/,
      /OneSignalSDKWorker\.js$/,
    ],
  },
});

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['dev.tglevels.me'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ra.tglevels.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "app.tglevels.in",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://app.tglevels.in/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';

              script-src 'self' 'unsafe-inline' ${
                isDev ? "'unsafe-eval'" : ""
              } https://tglevels.org https://cdn.onesignal.com https://onesignal.com https://api.onesignal.com   https://static.cloudflareinsights.com;

              style-src 'self' 'unsafe-inline'
                https://tglevels.org
                https://onesignal.com
                https://cdn.onesignal.com;

              style-src-elem 'self' 'unsafe-inline'
                https://tglevels.org
                https://onesignal.com
                https://cdn.onesignal.com;

              img-src 'self' data: blob:
                https://tglevels.org
                https://ra.tglevels.in
                https://app.tglevels.in;

              media-src 'self'
                https://tglevels.org;

              font-src 'self' data:
                https://tglevels.org;

              connect-src 'self'
                https://tglevels.org
                https://app.tglevels.in
                https://onesignal.com
                https://*.onesignal.com
                https://api.onesignal.com
                wss:
                ws:;

              frame-src 'self'
                https://tglevels.org
                https://onesignal.com;

              worker-src 'self'
                https://cdn.onesignal.com
                blob:;

              manifest-src 'self'
                https://onesignal.com;
            `
              .replace(/\n/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
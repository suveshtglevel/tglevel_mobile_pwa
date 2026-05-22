  // import { Inter } from "next/font/google";
  // import "./globals.css";
  // import StoreProvider from "@/redux/StoreProvider";

  // const inter = Inter({
  //   subsets: ["latin"],
  //   display: "swap",
  // });

  // export const metadata = {
  //   title: "TG Level",
  //   description: "TG Level - Premium Trading Signals Platform",
  //   manifest: "/manifest.json",
  //   appleWebApp: {
  //     capable: true,
  //     statusBarStyle: "default",
  //     title: "TG Level",
  //   },
  //   icons: {
  //     apple: "/tglogo.png",
  //   },
  // };

  // export const viewport = {
  //   themeColor: "#228B22",
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  //   userScalable: false,
  // };

  // export default function RootLayout({ children }) {
  //   return (
  //     <html lang="en">
  //       <body className={`${inter.className} antialiased bg-gray-100`}>
  //         <script dangerouslySetInnerHTML={{
  //           __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')`
  //         }} />
  //         <StoreProvider>
  //           {children}
  //         </StoreProvider>
  //       </body>
  //     </html>
  //   );
  // }


  import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "../redux/StoreProvider"; // ← relative path

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "TG Level",
  description: "TG Level - Premium Trading Signals Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TG Level",
  },
  icons: {
    apple: "/tglogo.png",
  },
};

export const viewport = {
  themeColor: "#228B22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const isDev = process.env.NODE_ENV === "development";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-100`}>
        <script dangerouslySetInnerHTML={{
          // In production register the PWA service worker.
          // In dev the SW is disabled (next.config), so unregister any stale
          // worker left over from a prod build — otherwise its outdated
          // precache manifest 404s ("bad-precaching-response").
          __html: isDev
            ? `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));if(window.caches){caches.keys().then(ks=>ks.forEach(k=>caches.delete(k)));}}`
            : `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')`
        }} />
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
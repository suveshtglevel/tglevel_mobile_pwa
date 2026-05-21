"use client";
import Script from "next/script";

export default function OneSignalInit() {
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer
        strategy="lazyOnload"
      />
      <Script id="onesignal-init" strategy="lazyOnload">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "5a978f74-24e6-468c-8b3e-9bc9ef810484",
              safari_web_id: "web.onesignal.auto.204803f7-478b-4564-9a97-0318e873c676",
              serviceWorkerPath: "sw.js",             // ← must be sw.js
              serviceWorkerParam: { scope: "/" },
              notifyButton: {
                enable: false,
              },
               promptOptions: {
                autoPrompt: true,      
                timeDelay: 0,            
                pageViews: 1,            
              },
                });
          });
        `}
      </Script>
    </>
  );
}
// 'use client';

// import { useRef, useState } from 'react';

// const CRM_URL = 'https://tglevels.org';

// export default function CrmChat({ name, mobile, email, userId }) {
//   const iframeRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const chatHtml = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
//   <link href="${CRM_URL}/css/main.css" type="text/css" rel="stylesheet">
//   <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     html, body { height: 100%; width: 100%; overflow: hidden; background: #fff; }
//     .sb-chat > .sb-body { display: none; position: static !important; width: 100% !important; height: 100vh !important; }
//     .sb-chat { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100% !important; height: 100% !important; z-index: 1 !important; }
//     .sb-chat-btn { display: none !important; }
//     .sb-icon-close.sb-responsive-close-btn { display: none !important; }
//     .sb-scroll-area { height: calc(100vh - 60px) !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch; }
//     .sb-editor { position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important; background: #fff; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 10; }
//     .sb-main.sb-chat.sb-dashboard-disabled { display: none !important; }
//   </style>
// </head>
// <body class="sb-chat-open">
//   <script>
//     var SB_AJAX_URL = "${CRM_URL}/include/ajax.php";
//     var SB_URL = "${CRM_URL}";
//     var SB_LANG = ["en", "front"];
//   </script>

//   <div class="sb-main sb-chat sb-no-conversations sb-dashboard-active sb-active"
//        style="position:fixed!important;top:0;left:0;right:0;bottom:0;">
//     <div class="sb-body">
//       <div class="sb-scroll-area">
//         <div class="sb-header sb-header-main sb-header-type-brand">
//           <div class="sb-content" style="opacity:1;top:0px;">
//             <div class="sb-title">Welcome</div>
//             <div class="sb-text">We are an experienced team that provides fast and accurate answers to your questions.</div>
//           </div>
//         </div>
//         <div class="sb-list"></div>
//         <div class="sb-dashboard sb-active">
//           <div class="sb-dashboard-conversations">
//             <div class="sb-title">Conversations</div>
//             <ul class="sb-user-conversations sb-one-conversation"></ul>
//             <div class="sb-btn sb-btn-new-conversation">New conversation</div>
//           </div>
//         </div>
//       </div>
//       <div class="sb-editor">
//         <div class="sb-textarea"><textarea placeholder="Write a message..."></textarea></div>
//         <div class="sb-bar">
//           <div class="sb-bar-icons">
//             <div class="sb-btn-attachment"></div>
//             <div class="sb-btn-emoji"></div>
//           </div>
//           <div class="sb-icon-send sb-submit"></div>
//           <i class="sb-loader"></i>
//         </div>
//       </div>
//     </div>
//     <audio id="sb-audio" preload="auto">
//       <source src="${CRM_URL}/media/sound.mp3" type="audio/mpeg">
//     </audio>
//   </div>

//   <script src="${CRM_URL}/js/min/jquery.min.js"></script>
//   <script
//     id="sbinit"
//     src="${CRM_URL}/js/main.js"
//     data-user-id="${userId}"
//     data-full-name="${name}"
//     data-phone="${mobile}"
//     data-email="${email}">
//   </script>
// </body>
// </html>`;

//   return (
//     <div className="fixed inset-0 z-50 bg-white flex flex-col">
//       {/* Header */}
//       <div className="flex items-center px-4 py-3 border-b bg-white">
//         <button onClick={() => window.history.back()} className="mr-3 text-gray-600">
//           ← Back
//         </button>
//         <span className="font-semibold">Support Chat</span>
//       </div>

//       {/* Chat iframe */}
//       <div className="flex-1 relative">
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           </div>
//         )}
//         <iframe
//           ref={iframeRef}
//           srcDoc={chatHtml}
//           className="w-full h-full border-none"
//           onLoad={() => setIsLoading(false)}
//           allow="microphone; camera"
//           sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
//         />
//       </div>
//     </div>
//   );
// }

// // app/support/page.jsx
// // jsximport CrmChat from '@/components/CrmChat';
// // import { getCurrentUser } from '@/lib/auth'; // your own auth util

// // export default async function SupportPage() {
// //   const user = await getCurrentUser();

// //   return (
// //     <CrmChat
// //       name={user.name}
// //       mobile={user.phone}
// //       email={user.email}
// //       userId={user._id}
// //     />
// //   );
// // }




'use client';

import { useMemo, useRef, useState } from 'react';

const CRM_URL = 'https://tglevels.org';

function CrmChatIframe({ name, mobile, email, userId }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const chatHtml = useMemo(() => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link href="${CRM_URL}/css/main.css" type="text/css" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; background: #fff; }
    .sb-chat > .sb-body { display: none; position: static !important; width: 100% !important; height: 100vh !important; }
    .sb-chat { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100% !important; height: 100% !important; z-index: 1 !important; }
    .sb-chat-btn { display: none !important; }
    .sb-icon-close.sb-responsive-close-btn { display: none !important; }
    .sb-scroll-area { height: calc(100vh - 60px) !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch; }
    .sb-editor { position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important; background: #fff; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 10; }
    .sb-main.sb-chat.sb-dashboard-disabled { display: none !important; }
  </style>
</head>
<body class="sb-chat-open">

  <!-- ✅ FIX: Clear old user session before CRM initializes -->
  <script>
    // localStorage.clear();
    // sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });
  </script>

  <script>
    var SB_AJAX_URL = "${CRM_URL}/include/ajax.php";
    var SB_URL = "${CRM_URL}";
    var SB_LANG = ["en", "front"];
  </script>

  <div class="sb-main sb-chat sb-no-conversations sb-dashboard-active sb-active"
       style="position:fixed!important;top:0;left:0;right:0;bottom:0;">
    <div class="sb-body">
      <div class="sb-scroll-area">
        <div class="sb-header sb-header-main sb-header-type-brand">
          <div class="sb-content" style="opacity:1;top:0px;">
            <div class="sb-title">Welcome</div>
            <div class="sb-text">We are an experienced team that provides fast and accurate answers to your questions.</div>
          </div>
        </div>
        <div class="sb-list"></div>
        <div class="sb-dashboard sb-active">
          <div class="sb-dashboard-conversations">
            <div class="sb-title">Conversations</div>
            <ul class="sb-user-conversations sb-one-conversation"></ul>
            <div class="sb-btn sb-btn-new-conversation">New conversation</div>
          </div>
        </div>
      </div>
      <div class="sb-editor">
        <div class="sb-textarea"><textarea placeholder="Write a message..."></textarea></div>
        <div class="sb-bar">
          <div class="sb-bar-icons">
            <div class="sb-btn-attachment"></div>
            <div class="sb-btn-emoji"></div>
          </div>
          <div class="sb-icon-send sb-submit"></div>
          <i class="sb-loader"></i>
        </div>
      </div>
    </div>
    <audio id="sb-audio" preload="auto">
      <source src="${CRM_URL}/media/sound.mp3" type="audio/mpeg">
    </audio>
  </div>

  <script src="${CRM_URL}/js/min/jquery.min.js"></script>
  <script
    id="sbinit"
    src="${CRM_URL}/js/main.js"
    data-user-id="${userId}"
    data-full-name="${name}"
    data-phone="${mobile}"
    data-email="${email}">
  </script>
</body>
</html>`, [userId, name, mobile, email]);

  return (
    <div className="flex-1 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        srcDoc={chatHtml}
        className="w-full h-full border-none"
        onLoad={() => setIsLoading(false)}
        allow="microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}

export default function CrmChat({ name, mobile, email, userId }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center px-4 py-3 border-b bg-white">
        <button
          onClick={() => window.history.back()}
          className="mr-3 text-gray-600"
        >
          ← Back
        </button>
        <span className="font-semibold">Support Chat</span>
      </div>

      <CrmChatIframe
        key={userId}
        name={name}
        mobile={mobile}
        email={email}
        userId={userId}
      />
    </div>
  );
}
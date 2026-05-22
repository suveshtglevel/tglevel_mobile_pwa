// "use client";

// import { useRef, useState, useEffect, useCallback, useMemo } from "react";

// const CRM_URL = "https://tglevels.org";

// function CrmChatIframe({ name, mobile, email, userId }) {
//   const iframeRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [iframeKey, setIframeKey] = useState(0);

//   const handleReload = useCallback(() => {
//     setIsLoading(true);
//     setIframeKey(k => k + 1);
//   }, []);

//   const chatHtml = useMemo(() => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// <link href="${CRM_URL}/css/main.css" rel="stylesheet">
// <style>
// * { margin: 0; padding: 0; box-sizing: border-box; }
// html, body { height: 100%; width: 100%; overflow: hidden; background: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

// .sb-chat-btn { display: none !important; }
// .sb-icon-close.sb-responsive-close-btn { display: none !important; }
// .sb-main.sb-chat.sb-dashboard-disabled { display: none !important; }
// .sb-header.sb-header-main { display: none !important; }

// .sb-chat {
//   position: fixed !important;
//   inset: 0;
//   width: 100% !important;
//   height: 100% !important;
//   z-index: 1 !important;
//   background: #f0f2f5 !important;
//   display: flex !important;
//   flex-direction: column !important;
// }

// .sb-body {
//   display: flex !important;
//   flex-direction: column !important;
//   height: 100% !important;
// }

// .sb-dashboard { display: none !important; }

// .sb-scroll-area {
//   flex: 1 !important;
//   overflow-y: auto !important;
//   -webkit-overflow-scrolling: touch;
//   padding: 16px 12px 100px !important;
//   background: #f0f2f5 !important;
// }

// .sb-message {
//   display: flex;
//   margin-bottom: 6px;
//   align-items: flex-end;
//   gap: 8px;
// }

// .sb-message .sb-avatar {
//   width: 28px !important;
//   height: 28px !important;
//   border-radius: 50% !important;
//   font-size: 11px !important;
//   flex-shrink: 0;
// }

// .sb-message .sb-text-message {
//   max-width: 72% !important;
//   padding: 9px 13px !important;
//   border-radius: 18px !important;
//   font-size: 14px !important;
//   line-height: 1.4 !important;
//   word-break: break-word;
// }

// .sb-message:not(.sb-right) .sb-text-message {
//   background: #ffffff !important;
//   color: #1a1a1a !important;
//   border-bottom-left-radius: 4px !important;
//   box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
// }

// .sb-message.sb-right .sb-text-message {
//   background: #04386C !important;
//   color: #ffffff !important;
//   border-bottom-right-radius: 4px !important;
//   box-shadow: 0 1px 2px rgba(4,56,108,0.3) !important;
// }

// .sb-message-time, .sb-time {
//   font-size: 10px !important;
//   color: #999 !important;
//   margin-top: 3px !important;
//   padding: 0 4px !important;
// }

// .sb-btn.sb-btn-new-conversation { display: none !important; }

// .sb-editor {
//   position: fixed !important;
//   bottom: 0 !important;
//   left: 0 !important;
//   width: 100% !important;
//   background: #ffffff !important;
//   border-top: 1px solid #e8eaed !important;
//   padding: 10px 12px calc(10px + env(safe-area-inset-bottom)) 12px !important;
//   z-index: 10 !important;
//   display: flex !important;
//   align-items: flex-end !important;
//   gap: 8px !important;
//   box-sizing: border-box !important;
// }

// .sb-textarea {
//   flex: 1 !important;
//   background: #f0f2f5 !important;
//   border-radius: 24px !important;
//   padding: 10px 16px !important;
//   min-height: 42px !important;
//   max-height: 120px !important;
//   display: flex !important;
//   align-items: center !important;
//   min-width: 0 !important;
// }

// .sb-textarea textarea {
//   width: 100% !important;
//   border: none !important;
//   background: transparent !important;
//   outline: none !important;
//   resize: none !important;
//   font-size: 14px !important;
//   color: #1a1a1a !important;
//   line-height: 1.4 !important;
//   max-height: 100px !important;
//   overflow-y: auto !important;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
// }

// .sb-textarea textarea::placeholder { color: #aaa !important; }

// /* Hide SB's default bar but keep the hidden submit button functional */
// .sb-bar {
//   position: absolute !important;
//   opacity: 0 !important;
//   pointer-events: none !important;
//   width: 0 !important;
//   height: 0 !important;
//   overflow: hidden !important;
// }

// #custom-send-btn {
//   width: 44px !important;
//   height: 44px !important;
//   min-width: 44px !important;
//   border-radius: 50% !important;
//   background: #04386C !important;
//   border: none !important;
//   cursor: pointer !important;
//   display: flex !important;
//   align-items: center !important;
//   justify-content: center !important;
//   flex-shrink: 0 !important;
//   transition: background 0.2s, transform 0.1s !important;
//   box-shadow: 0 2px 8px rgba(4,56,108,0.4) !important;
// }

// #custom-send-btn:active {
//   transform: scale(0.92) !important;
//   background: #02264d !important;
// }

// #custom-send-btn svg {
//   width: 18px;
//   height: 18px;
//   fill: #fff;
//   margin-left: 2px;
// }

// #sb-send-status {
//   font-size: 10px;
//   color: #999;
//   text-align: right;
//   padding: 0 16px 4px;
//   min-height: 16px;
//   transition: opacity 0.3s;
// }

// .sb-user-conversations li {
//   background: #fff !important;
//   border-radius: 12px !important;
//   padding: 12px !important;
//   margin-bottom: 8px !important;
//   box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
//   cursor: pointer !important;
// }
// </style>
// </head>
// <body class="sb-chat-open">

// <script>
//   window.SB_AJAX_URL = "${CRM_URL}/include/ajax.php";
//   window.SB_URL = "${CRM_URL}";
//   window.SB_LANG = ["en", "front"];

//   // ── Status label ──────────────────────────────────────────────
//   function setStatus(state) {
//     var el = document.getElementById('sb-send-status');
//     if (!el) return;
//     if (state === 'sending')   { el.textContent = '🕐 Sending...';    el.style.opacity = '1'; }
//     if (state === 'delivered') { el.textContent = '✓✓ Delivered';     el.style.opacity = '1'; }
//     if (state === 'failed')    { el.textContent = '❌ Failed to send'; el.style.opacity = '1'; }
//     if (state === '')          { el.textContent = '';                  el.style.opacity = '0'; }
//   }

//   var _clearTimer = null;
//   function scheduleStatusClear() {
//     clearTimeout(_clearTimer);
//     _clearTimer = setTimeout(function() { setStatus(''); }, 3000);
//   }

//   // ── XHR interceptor — watches SB's OWN send XHR ──────────────
//   // We let SB send the message normally, we just watch the response
//   var _origOpen = XMLHttpRequest.prototype.open;
//   var _origSend = XMLHttpRequest.prototype.send;
//   var _isSending = false;

//   XMLHttpRequest.prototype.open = function(method, url) {
//     this._url = url;
//     return _origOpen.apply(this, arguments);
//   };

//   XMLHttpRequest.prototype.send = function(body) {
//     var xhr = this;
//     // Only watch ajax.php calls
//     if (xhr._url && xhr._url.indexOf('ajax.php') !== -1) {
//       xhr.addEventListener('load', function() {
//         if (!_isSending) return;
//         try {
//           var resp = JSON.parse(xhr.responseText);
//           // SupportBoard send-message returns the new message id on success
//           if (xhr.status >= 200 && xhr.status < 300 && resp && !resp.error) {
//             _isSending = false;
//             setStatus('delivered');
//             scheduleStatusClear();
//           } else if (resp && resp.error) {
//             _isSending = false;
//             setStatus('failed');
//           }
//         } catch(e) {}
//       });
//       xhr.addEventListener('error', function() {
//         if (_isSending) {
//           _isSending = false;
//           setStatus('failed');
//         }
//       });
//     }
//     return _origSend.apply(this, arguments);
//   };

//   window.addEventListener('message', function(e) {
//     if (!e.data || !e.data.type) return;
//     if (e.data.type === 'SB_FORCE_REFRESH') {
//       if (window.SB) {
//         if (typeof window.SB.update === 'function') window.SB.update();
//         if (window.SB.conversations && typeof window.SB.conversations.refresh === 'function') {
//           window.SB.conversations.refresh();
//         }
//       }
//     }
//   });

//   document.addEventListener('DOMContentLoaded', function() {
//     var sendBtn = document.getElementById('custom-send-btn');

//     // ── doSend: let SB handle the actual send, we just trigger it ──
//     function doSend() {
//       var textarea = document.querySelector('.sb-textarea textarea');
//       if (!textarea || !textarea.value.trim()) return;

//       // Find SB's hidden submit — this is the ONLY reliable way
//       // because SB manages conversation_id, token, user internally
//       var sbSubmit = document.querySelector('.sb-icon-send.sb-submit');
//       if (!sbSubmit) {
//         console.warn('[SB] .sb-icon-send.sb-submit not found');
//         return;
//       }

//       _isSending = true;
//       setStatus('sending');

//       // Trigger SB's own send — it handles everything internally
//       sbSubmit.click();
//     }

//     if (sendBtn) sendBtn.addEventListener('click', doSend);

//     document.addEventListener('keydown', function(e) {
//       if (e.key === 'Enter' && !e.shiftKey) {
//         if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') {
//           e.preventDefault();
//           doSend();
//         }
//       }
//     });

//     // ── Auto-open latest conversation ──────────────────────────
//     function autoOpenChat() {
//       var items = document.querySelectorAll('.sb-user-conversations li');
//       if (items && items.length > 0) {
//         items[0].click();
//       } else {
//         var newBtn = document.querySelector('.sb-btn-new-conversation');
//         if (newBtn) newBtn.click();
//       }
//     }

//     var attempts = 0;
//     var initCheck = setInterval(function() {
//       attempts++;
//       if (window.SB) {
//         clearInterval(initCheck);
//         setTimeout(autoOpenChat, 150);
//       }
//       if (attempts > 40) clearInterval(initCheck);
//     }, 150);
//   });
// </script>

// <div class="sb-main sb-chat sb-no-conversations sb-dashboard-active sb-active">
//   <div class="sb-body">
//     <div class="sb-scroll-area">
//       <div class="sb-list"></div>
//       <div class="sb-dashboard sb-active">
//         <div class="sb-dashboard-conversations">
//           <div class="sb-title">Conversations</div>
//           <ul class="sb-user-conversations sb-one-conversation"></ul>
//         </div>
//       </div>
//     </div>

//     <div id="sb-send-status" style="opacity:0;"></div>

//     <div class="sb-editor">
//       <div class="sb-textarea">
//         <textarea placeholder="Type a message..."></textarea>
//       </div>

//       <button id="custom-send-btn" title="Send">
//         <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
//         </svg>
//       </button>

//       <!-- SB's real submit — hidden but MUST stay in DOM so SB can find it -->
//       <div class="sb-bar">
//         <div class="sb-icon-send sb-submit"></div>
//         <i class="sb-loader"></i>
//       </div>
//     </div>
//   </div>

//   <audio id="sb-audio" preload="auto">
//     <source src="${CRM_URL}/media/sound.mp3" type="audio/mpeg">
//   </audio>
// </div>

// <script src="${CRM_URL}/js/min/jquery.min.js"></script>
// <script
//   id="sbinit"
//   src="${CRM_URL}/js/main.js"
//   data-user-id="${userId}"
//   data-full-name="${name}"
//   data-phone="${mobile}"
//   data-email="${email}">
// </script>

// </body>
// </html>
//   `, [userId, name, mobile, email]);

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (!event.data?.type) return;
//     };
//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   return (
//     <div className="flex-1 relative">
//       {isLoading && (
//         <div className="absolute inset-0 flex flex-col gap-3 p-4 bg-[#f0f2f5] z-10">
//           <div className="h-9 w-2/3 bg-white rounded-2xl animate-pulse" />
//           <div className="h-9 w-1/2 bg-white rounded-2xl animate-pulse" />
//           <div className="h-9 w-3/4 bg-[#d0dff0] rounded-2xl animate-pulse self-end" />
//           <div className="h-9 w-1/2 bg-white rounded-2xl animate-pulse" />
//           <div className="h-9 w-2/3 bg-[#d0dff0] rounded-2xl animate-pulse self-end" />
//         </div>
//       )}

//       <iframe
//         key={iframeKey}
//         ref={iframeRef}
//         srcDoc={chatHtml}
//         className="w-full h-full border-none"
//         onLoad={() => setIsLoading(false)}
//         allow="microphone; camera"
//         sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
//       />
//     </div>
//   );
// }

// export default function CrmChat() {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     try {
//       const userId  = localStorage.getItem("user_id");
//       const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

//       if (!userId) {
//         window.location.href = "/profile?from=crm";
//         return;
//       }

//       setUserData({
//         userId,
//         name:   profile.fullName || profile.name || "",
//         email:  profile.email    || "",
//         mobile: profile.phone    || localStorage.getItem("phone") || "",
//       });

//     } catch {
//       window.location.href = "/profile?from=crm";
//     }
//   }, []);

//   if (!userData) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-white flex flex-col">
//       <div className="flex items-center px-4 py-3 bg-white border-b shadow-sm">
//         <button
//           onClick={() => window.history.back()}
//           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 mr-3"
//         >
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M19 12H5M12 19l-7-7 7-7"/>
//           </svg>
//         </button>

//         <div className="w-9 h-9 rounded-full bg-[#04386C] flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
//           S
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="font-semibold text-gray-900 text-sm leading-tight">Support Chat</div>
//           <div className="flex items-center gap-1 mt-0.5">
//             <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
//             <span className="text-xs text-green-600 font-medium">Online</span>
//           </div>
//         </div>

//         <button
//           onClick={() => {
//             const iframe = document.querySelector('iframe');
//             iframe?.contentWindow?.postMessage({ type: 'SB_FORCE_REFRESH' }, '*');
//           }}
//           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
//           title="Refresh"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
//             <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
//           </svg>
//         </button>
//       </div>

//       <CrmChatIframe
//         key={userData.userId}
//         name={userData.name}
//         mobile={userData.mobile}
//         email={userData.email}
//         userId={userData.userId}
//       />
//     </div>
//   );
// }


"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const CRM_URL = "https://tglevels.org";

function CrmChatIframe({ name, mobile, email, userId }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const handleReload = useCallback(() => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  }, []);

  const chatHtml = useMemo(() => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<!-- Loaded via same-origin /crm proxy so @font-face fonts (relative ../media/* URLs) avoid CORS -->
<link href="/crm/css/main.css" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; width: 100%; overflow: hidden; background: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

.sb-chat-btn { display: none !important; }
.sb-icon-close.sb-responsive-close-btn { display: none !important; }
.sb-main.sb-chat.sb-dashboard-disabled { display: none !important; }
.sb-header.sb-header-main { display: none !important; }

.sb-chat {
  position: fixed !important;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
  background: #f0f2f5 !important;
  display: flex !important;
  flex-direction: column !important;
}

.sb-body {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

.sb-dashboard { display: none !important; }

.sb-scroll-area {
  flex: 1 !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  padding: 16px 12px 100px !important;
  background: #f0f2f5 !important;
}

.sb-message {
  display: flex;
  margin-bottom: 6px;
  align-items: flex-end;
  gap: 8px;
}

.sb-message .sb-avatar {
  width: 28px !important;
  height: 28px !important;
  border-radius: 50% !important;
  font-size: 11px !important;
  flex-shrink: 0;
}

.sb-message .sb-text-message {
  max-width: 72% !important;
  padding: 9px 13px !important;
  border-radius: 18px !important;
  font-size: 14px !important;
  line-height: 1.4 !important;
  word-break: break-word;
}

.sb-message:not(.sb-right) .sb-text-message {
  background: #ffffff !important;
  color: #1a1a1a !important;
  border-bottom-left-radius: 4px !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
}

.sb-message.sb-right .sb-text-message {
  background: #04386C !important;
  color: #ffffff !important;
  border-bottom-right-radius: 4px !important;
  box-shadow: 0 1px 2px rgba(4,56,108,0.3) !important;
}

.sb-message-time, .sb-time {
  font-size: 10px !important;
  color: #999 !important;
  margin-top: 3px !important;
  padding: 0 4px !important;
}

.sb-btn.sb-btn-new-conversation { display: none !important; }

.sb-editor {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  background: #ffffff !important;
  border-top: 1px solid #e8eaed !important;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom)) 12px !important;
  z-index: 10 !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  box-sizing: border-box !important;
}

.sb-textarea {
  flex: 1 !important;
  background: #f0f2f5 !important;
  border-radius: 24px !important;
  padding: 10px 16px !important;
  min-height: 42px !important;
  max-height: 120px !important;
  display: flex !important;
  align-items: center !important;
  min-width: 0 !important;
}

.sb-textarea textarea {
  width: 100% !important;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  resize: none !important;
  font-size: 14px !important;
  color: #1a1a1a !important;
  line-height: 1.4 !important;
  max-height: 100px !important;
  overflow-y: auto !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

.sb-textarea textarea::placeholder { color: #aaa !important; }

.sb-bar {
  position: absolute !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}

#custom-send-btn {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  border-radius: 50% !important;
  background: #04386C !important;
  border: none !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  transition: background 0.2s, transform 0.1s !important;
  box-shadow: 0 2px 8px rgba(4,56,108,0.4) !important;
}

#custom-send-btn:active {
  transform: scale(0.92) !important;
  background: #02264d !important;
}

#custom-send-btn svg {
  width: 18px;
  height: 18px;
  fill: #fff;
  margin-left: 2px;
}

#sb-send-status {
  font-size: 10px;
  color: #999;
  text-align: right;
  padding: 0 16px 4px;
  min-height: 16px;
  transition: opacity 0.3s;
}

.sb-user-conversations li {
  background: #fff !important;
  border-radius: 12px !important;
  padding: 12px !important;
  margin-bottom: 8px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
  cursor: pointer !important;
}
</style>
</head>
<body class="sb-chat-open">

<script>
  window.SB_AJAX_URL = "${CRM_URL}/include/ajax.php";
  window.SB_URL = "${CRM_URL}";
  window.SB_LANG = ["en", "front"];

  function setStatus(state) {
    var el = document.getElementById('sb-send-status');
    if (!el) return;
    if (state === 'sending')   { el.textContent = '🕐 Sending...';    el.style.opacity = '1'; }
    if (state === 'delivered') { el.textContent = '✓✓ Delivered';     el.style.opacity = '1'; }
    if (state === 'failed')    { el.textContent = '❌ Failed to send'; el.style.opacity = '1'; }
    if (state === '')          { el.textContent = '';                  el.style.opacity = '0'; }
  }

  var _clearTimer = null;
  function scheduleStatusClear() {
    clearTimeout(_clearTimer);
    _clearTimer = setTimeout(function() { setStatus(''); }, 3000);
  }

  var _origOpen = XMLHttpRequest.prototype.open;
  var _origSend = XMLHttpRequest.prototype.send;
  var _isSending = false;
  var _sendingTimeout = null;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return _origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    var xhr = this;
    if (xhr._url && xhr._url.indexOf('ajax.php') !== -1) {
      xhr.addEventListener('load', function() {
        if (!_isSending) return;
        try {
          var resp = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && resp && !resp.error) {
            _isSending = false;
            clearTimeout(_sendingTimeout);
            setStatus('delivered');
            scheduleStatusClear();
            // One refresh AFTER the send returns (not during) so the message
            // renders immediately without competing with the in-flight send.
            if (window.SBChat && typeof window.SBChat.update === 'function') {
              try { window.SBChat.update(); } catch (e) {}
            }
          } else if (resp && resp.error) {
            _isSending = false;
            clearTimeout(_sendingTimeout);
            setStatus('failed');
          }
        } catch(e) {}
      });
      xhr.addEventListener('error', function() {
        if (_isSending) { _isSending = false; setStatus('failed'); }
      });
    }
    return _origSend.apply(this, arguments);
  };

  window.addEventListener('message', function(e) {
    if (!e.data || !e.data.type) return;
    if (e.data.type === 'SB_FORCE_REFRESH') {
      if (window.SB) {
        if (typeof window.SB.update === 'function') window.SB.update();
        if (window.SB.conversations && typeof window.SB.conversations.refresh === 'function') {
          window.SB.conversations.refresh();
        }
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    var sendBtn = document.getElementById('custom-send-btn');

    function doSend() {
      var textarea = document.querySelector('.sb-textarea textarea');
      if (!textarea || !textarea.value.trim()) return;

      var sbSubmit = document.querySelector('.sb-icon-send.sb-submit');
      if (!sbSubmit) {
        console.warn('[SB] .sb-icon-send.sb-submit not found');
        return;
      }

      _isSending = true;
      setStatus('sending');
      sbSubmit.click();

      // Safety net: if no ajax.php response is detected (network stall), don't
      // let the "Sending..." label hang forever — clear it after a timeout.
      clearTimeout(_sendingTimeout);
      _sendingTimeout = setTimeout(function () {
        if (_isSending) { _isSending = false; setStatus(''); }
      }, 12000);
    }

    if (sendBtn) sendBtn.addEventListener('click', doSend);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') {
          e.preventDefault();
          doSend();
        }
      }
    });

    function autoOpenChat() {
      var items = document.querySelectorAll('.sb-user-conversations li');
      if (items && items.length > 0) {
        items[0].click();
      } else {
        var newBtn = document.querySelector('.sb-btn-new-conversation');
        if (newBtn) newBtn.click();
      }
    }

    // Live polling — Support Board's built-in poll only runs every 15s (and no
    // Pusher push is configured), so incoming agent messages would otherwise
    // need a manual refresh. Poll SBChat.update() every 2.5s for near-instant
    // chat. Pause when the tab is hidden or a send is in flight (so we never
    // recreate request congestion against the slow ajax endpoint).
    var _livePoll = null;
    function startLivePolling() {
      if (_livePoll) return;
      _livePoll = setInterval(function () {
        try {
          if (document.hidden || _isSending) return;
          if (window.SBChat && typeof window.SBChat.update === 'function') {
            window.SBChat.update();
          }
        } catch (e) {}
      }, 2500);
    }

    // Refresh immediately when the user returns to the tab.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && window.SBChat && typeof window.SBChat.update === 'function') {
        try { window.SBChat.update(); } catch (e) {}
      }
    });

    var attempts = 0;
    var initCheck = setInterval(function() {
      attempts++;
      // The SB global is SBChat (there is no window.SB); gate readiness on it.
      if (window.SBChat) {
        clearInterval(initCheck);
        setTimeout(autoOpenChat, 150);
        startLivePolling();
      }
      if (attempts > 40) clearInterval(initCheck);
    }, 150);
  });
</script>

<div class="sb-main sb-chat sb-no-conversations sb-dashboard-active sb-active">
  <div class="sb-body">
    <div class="sb-scroll-area">
      <div class="sb-list"></div>
      <div class="sb-dashboard sb-active">
        <div class="sb-dashboard-conversations">
          <div class="sb-title">Conversations</div>
          <ul class="sb-user-conversations sb-one-conversation"></ul>
        </div>
      </div>
    </div>

    <div id="sb-send-status" style="opacity:0;"></div>

    <div class="sb-editor">
      <div class="sb-textarea">
        <textarea placeholder="Type a message..."></textarea>
      </div>

      <button id="custom-send-btn" title="Send">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>

      <div class="sb-bar">
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
</html>
  `, [userId, name, mobile, email]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data?.type) return;
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col gap-3 p-4 bg-[#f0f2f5] z-10">
          <div className="h-9 w-2/3 bg-white rounded-2xl animate-pulse" />
          <div className="h-9 w-1/2 bg-white rounded-2xl animate-pulse" />
          <div className="h-9 w-3/4 bg-[#d0dff0] rounded-2xl animate-pulse self-end" />
          <div className="h-9 w-1/2 bg-white rounded-2xl animate-pulse" />
          <div className="h-9 w-2/3 bg-[#d0dff0] rounded-2xl animate-pulse self-end" />
        </div>
      )}
      <iframe
        key={iframeKey}
        ref={iframeRef}
        srcDoc={chatHtml}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
        onLoad={() => setIsLoading(false)}
        allow="microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

export default function CrmChat() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      const userId  = localStorage.getItem("user_id");
      const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      if (!userId) { window.location.href = "/profile?from=crm"; return; }
      setUserData({
        userId,
        name:   profile.fullName || profile.name || "",
        email:  profile.email    || "",
        mobile: profile.phone    || localStorage.getItem("phone") || "",
      });
    } catch {
      window.location.href = "/profile?from=crm";
    }
  }, []);

  if (!userData) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#e8edf2', display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
      <div style={{ width: '100%', maxWidth: 463, background: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-white border-b shadow-sm flex-shrink-0">
        <button
          onClick={() => window.history.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 mr-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="w-9 h-9 rounded-full bg-[#04386C] flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
          S
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm leading-tight">Support Chat</div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>

        <button
          onClick={() => {
            const iframe = document.querySelector('iframe');
            iframe?.contentWindow?.postMessage({ type: 'SB_FORCE_REFRESH' }, '*');
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          title="Refresh"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
        </button>
      </div>

      {/* Iframe fills all remaining space */}
      <CrmChatIframe
        key={userData.userId}
        name={userData.name}
        mobile={userData.mobile}
        email={userData.email}
        userId={userData.userId}
      />
      </div>
    </div>
  );
}
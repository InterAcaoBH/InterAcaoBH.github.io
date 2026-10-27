const C="lm-v4";const F=["./","index.html","style.css","app.js","manifest.json","images/logo.svg","images/icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();if(n.ok)caches.open(C).then(c=>c.put(e.request,cp));return n}).catch(()=>caches.match(e.request))));

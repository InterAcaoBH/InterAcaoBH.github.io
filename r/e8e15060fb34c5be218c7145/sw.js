const C="lm-v2";const F=["./","index.html","style.css","app.js","images/logo.svg","fonts/archivo.woff2","fonts/bebas.woff2"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();if(n.ok)caches.open(C).then(c=>c.put(e.request,cp));return n}))));

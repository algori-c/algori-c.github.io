// public/service-worker.js

// 캐시 사용을 비활성화했으므로 CACHE_NAME과 urlsToCache는 더 이상 필요하지 않습니다.
// const CACHE_NAME = 'my-app-cache-v1';

// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/favicon.ico',
//   '/logo192.png',
//   '/logo512.png',
//   '/static/js/bundle.js',
//   // 필요한 다른 리소스들도 추가하세요.
// ];

// 설치 이벤트: 더 이상 캐시할 리소스가 없으므로 기본 설치 이벤트만 처리합니다.
self.addEventListener('install', (event) => {
  // 서비스 워커 설치가 완료되면 바로 활성화되도록 합니다.
  self.skipWaiting();
});

// 활성화 이벤트: 더 이상 캐시를 정리할 필요가 없으므로 기본 활성화 이벤트만 처리합니다.
self.addEventListener('activate', (event) => {
  // 활성화 시 기존의 서비스 워커를 제어할 수 있도록 클라이언트를 즉시 제어합니다.
  event.waitUntil(self.clients.claim());
});

// 요청이 있을 때 네트워크에서 직접 가져옵니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // 네트워크 요청이 실패할 경우 대체 동작을 정의할 수 있습니다.
        // 예를 들어, 오프라인일 때 기본 페이지를 제공할 수 있습니다.
        return fetch('/index.html');
      })
  );
});

// 메시지 이벤트: 현재 로직을 유지하거나 필요에 따라 수정할 수 있습니다.
// 캐싱과 관련된 로직이 제거되었으므로, 이 부분은 필요에 따라 조정 가능합니다.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
// public/service-worker.js

// 캐시된 리소스의 캐시 이름을 정의합니다.
const CACHE_NAME = 'my-app-cache-v1';

// 캐시할 리소스 목록을 정의합니다. 빌드 후 생성된 리소스 경로를 추가하세요.
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/bundle.js',
  // 필요한 다른 리소스들도 추가하세요.
];

// 설치 이벤트: 캐시를 열고 지정된 리소스를 캐시에 추가합니다.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 열림:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('캐시 추가 실패:', error);
      })
  );
});

// 요청이 있을 때 캐시된 리소스가 있으면 반환하고, 없으면 네트워크에서 가져옵니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시된 리소스가 있으면 반환
        if (response) {
          return response;
        }
        // 없으면 네트워크에서 가져옴
        return fetch(event.request);
      })
      .catch(() => {
        // 네트워크가 없고 캐시도 없을 때 표시할 대체 내용 (선택 사항)
        return caches.match('/index.html');
      })
  );
});

// 활성화 이벤트: 이전 캐시를 정리합니다.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('캐시 삭제:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// 메시지 이벤트: 새로운 서비스 워커로 업데이트를 수락할 때 사용
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
import { useEffect, useState } from "react";

export default function useKakaoLoader() {
  const [ready, setReady] = useState(!!window.kakao?.maps);

  useEffect(() => {
    if (ready) return;

    // ✅ Vite와 CRA 모두 지원
    const appKey =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_KAKAO_APP_KEY) ||
      process.env.REACT_APP_KAKAO_APP_KEY;

    // 디버그 로그 (빌드 전용 상수라 보안상 큰 문제 없음 / 배포 땐 지워도 OK)
    // 콘솔에 undefined가 찍히면 .env를 못 읽는 것
    // eslint-disable-next-line no-console
    console.log("[Kakao] appKey =", appKey ? "(loaded)" : "undefined");

    if (!appKey) {
      console.warn("[Kakao] 앱 키가 없습니다. .env에 REACT_APP_KAKAO_APP_KEY 또는 VITE_KAKAO_APP_KEY를 설정하세요.");
      return;
    }

    // 이미 로드/로딩 중인 스크립트 있으면 재사용
    const existed = document.querySelector('script[data-kakao-maps]');
    if (existed) {
      if (window.kakao?.maps) {
        setReady(true);
      } else {
        existed.addEventListener("load", () => setReady(!!window.kakao?.maps), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-kakao-maps", "true");

    script.onload = () => {
      // eslint-disable-next-line no-console
      console.log("[Kakao] SDK script loaded, calling kakao.maps.load()");
      window.kakao.maps.load(() => {
        // eslint-disable-next-line no-console
        console.log("[Kakao] kakao.maps loaded");
        setReady(true);
      });
    };
    script.onerror = () => {
      console.error("[Kakao] SDK 로드 실패. 네트워크 / 도메인 허용 / 키 확인 필요");
    };

    document.head.appendChild(script);
  }, [ready]);

  return ready;
}
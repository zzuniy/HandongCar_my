// src/hooks/useKakaoLoader.js
import { useEffect, useState } from "react";

/**
 * Kakao Maps SDK 로더
 * - autoload=false로 불러오고 kakao.maps.load() 이후 ready=true
 * - libraries=services 필수(장소검색)
 */
export default function useKakaoLoader(appKey) {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // 이미 로드된 경우
    if (window.kakao?.maps && window.kakao.maps.services) {
      setReady(true);
      return;
    }
    if (!appKey) {
      setErr(new Error("Kakao APP KEY 누락"));
      return;
    }

    const id = "kakao-sdk";
    const exist = document.getElementById(id);
    if (exist) return;

    const script = document.createElement("script");
    // services 필수, autoload=false
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.id = id;

    script.onload = () => {
      if (!window.kakao?.maps) {
        setErr(new Error("kakao.maps 로드 실패"));
        return;
      }
      window.kakao.maps.load(() => {
        // services까지 준비되었는지 재확인
        if (window.kakao.maps.services) {
          setReady(true);
        } else {
          setErr(new Error("services 라이브러리 로드 실패"));
        }
      });
    };

    script.onerror = () => {
      setErr(new Error("Kakao SDK 스크립트 로드 실패"));
    };

    document.head.appendChild(script);

    return () => {
      // 스크립트 제거는 개발 중 중복 방지용
      // 프로덕션에서는 보통 유지
    };
  }, [appKey]);

  return { ready, err };
}
// src/hooks/useKakaoLoader.js
import { useEffect, useState } from "react";

export default function useKakaoLoader(appKey) {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!appKey) { setErr(new Error("KAKAO_APP_KEY 누락")); return; }
    // 이미 로드됨
    if (window.kakao?.maps) { setReady(true); return; }

    const scriptId = "kakao-maps-sdk";
    if (document.getElementById(scriptId)) return;

    const s = document.createElement("script");
    s.id = scriptId;
    s.async = true;
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    s.onload = () => {
      /* global kakao */
      window.kakao.maps.load(() => setReady(true));
    };
    s.onerror = () => setErr(new Error("카카오 SDK 로드 실패"));
    document.head.appendChild(s);
  }, [appKey]);

  return { ready, err };
}
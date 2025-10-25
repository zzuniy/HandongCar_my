// src/components/MapSearchInput.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import useKakaoLoader from "../hooks/useKakaoLoader";
import styles from "../assets/styles/create&update.module.css";

export default function MapSearchInput({
  label = "장소",
  placeholder = "건물/장소명으로 검색",
  value,        // {name,address,lat,lng} | null
  onChange,     // (placeObj|null) => void
  disabled,
  defaultCenter // {lat,lng} 선택사항 (예: 한동대 좌표) 
}) {
  const { ready, err } = useKakaoLoader(process.env.REACT_APP_KAKAO_APP_KEY);
  const [keyword, setKeyword] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const placesRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Kakao Places 인스턴스 준비
  useEffect(() => {
    if (!ready) return;
    if (!placesRef.current) {
      // 검색 결과 기준 좌표가 있으면 그걸로, 없으면 한국 중앙부 approx
      const center = new window.kakao.maps.LatLng(
        defaultCenter?.lat ?? 36.5,
        defaultCenter?.lng ?? 127.8
      );
      const dummyEl = document.createElement("div"); // 보이지 않는 더미 맵
      const map = new window.kakao.maps.Map(dummyEl, { center, level: 5 });
      mapRef.current = map;
      placesRef.current = new window.kakao.maps.services.Places(map);
    }
  }, [ready, defaultCenter]);

  const debouncedSearch = useMemo(() => {
    let h;
    return (kw) => {
      clearTimeout(h);
      if (!kw?.trim()) { setResults([]); return; }
      h = setTimeout(() => {
        if (!placesRef.current) return;
        setLoading(true);
        placesRef.current.keywordSearch(kw, (data, status) => {
          setLoading(false);
          if (status === window.kakao.maps.services.Status.OK) {
            setResults(data.slice(0, 8)); // 상위 8개만
          } else {
            setResults([]);
          }
        });
      }, 250);
    };
  }, []);

  // 타이핑하면 검색
  useEffect(() => {
    if (!touched) return;
    debouncedSearch(keyword);
  }, [keyword, touched, debouncedSearch]);

  // 선택 이벤트
  const pick = (item) => {
    const next = {
      name: item.place_name,
      address: item.road_address_name || item.address_name || "",
      lat: parseFloat(item.y),
      lng: parseFloat(item.x),
    };
    setKeyword(next.name);
    setResults([]);
    onChange?.(next);

    // 미니 미리보기(선택사항): 선택 후 맵/마커 갱신
    // 이 컴포넌트 외부에 map 컨테이너를 두지 않고, 선택 UI만 쓰려면 아래는 스킵 가능
  };

  const clear = () => {
    setKeyword("");
    setResults([]);
    onChange?.(null);
  };

  return (
    <div className={styles.field} style={{ position: "relative" }}>
      <label className={styles.label}>{label}</label>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          className={styles.input}
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setTouched(true)}
          disabled={disabled || !ready}
        />
        {value && (
          <button
            type="button"
            className={styles.button}
            onClick={clear}
            disabled={disabled}
            style={{ whiteSpace: "nowrap" }}
          >
            지우기
          </button>
        )}
      </div>

      {/* 결과 드롭다운 */}
      {(results.length > 0 || loading) && (
        <ul
          style={{
            position: "absolute",
            zIndex: 20,
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid rgba(230,232,240,.7)",
            borderRadius: 8,
            marginTop: 6,
            maxHeight: 260,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(22,24,35,.12)",
          }}
        >
          {loading && (
            <li style={{ padding: 12, fontSize: 14 }}>검색 중…</li>
          )}
          {!loading &&
            results.map((r) => (
              <li
                key={r.id}
                onClick={() => pick(r)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ fontWeight: 600 }}>{r.place_name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {r.road_address_name || r.address_name}
                </div>
              </li>
            ))}
        </ul>
      )}

      {/* 선택 결과 요약 */}
      {value && (
        <p style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
          선택됨: <strong>{value.name}</strong>
          {value.address ? ` · ${value.address}` : ""} · ({value.lat.toFixed(5)}, {value.lng.toFixed(5)})
        </p>
      )}

      {/* 오류 핸들링 */}
      {err && <p className={styles.error}>카카오 로드 오류: {err.message}</p>}
    </div>
  );
}
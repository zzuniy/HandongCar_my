// src/components/MapSearchInput.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import useKakaoLoader from "../hooks/useKakaoLoader";
import styles from "../assets/styles/create&update.module.css";

export default function MapSearchInput({
  label = "장소",
  placeholder = "건물/장소명으로 검색",
  value = "",                // 선택된 장소 텍스트(문자열)
  onChange,                  // (placeObj|null) => void
  disabled = false,
  defaultCenter              // {lat,lng} (선택)
}) {
  const { ready, err } = useKakaoLoader(process.env.REACT_APP_KAKAO_APP_KEY);

  // 인풋 표시 텍스트(타이핑용)
  const [q, setQ] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const placesRef = useRef(null);

  // Places 인스턴스 준비
  useEffect(() => {
    if (!ready || placesRef.current) return;
    const center = new window.kakao.maps.LatLng(
      defaultCenter?.lat ?? 36.5,
      defaultCenter?.lng ?? 127.8
    );
    const dummy = document.createElement("div");
    const map = new window.kakao.maps.Map(dummy, { center, level: 5 });
    placesRef.current = new window.kakao.maps.services.Places(map);
    console.log("[MSI] Places ready");
  }, [ready, defaultCenter]);

  // 외부 value가 바뀌면 인풋 텍스트와 동기화
  useEffect(() => { setQ(value || ""); }, [value]);

  // 디바운스 검색 함수
  const search = useMemo(() => {
    let t;
    return (kw) => {
      clearTimeout(t);
      if (!kw?.trim() || !placesRef.current) {
        setItems([]);
        return;
      }
      t = setTimeout(() => {
        setLoading(true);
        console.log("[MSI] search:", kw);
        placesRef.current.keywordSearch(kw, (data, status) => {
          setLoading(false);
          console.log("[MSI] result:", status, data?.length);
          if (status === window.kakao.maps.services.Status.OK) {
            setItems(data.slice(0, 8));   // 상위 8개
          } else {
            setItems([]);
          }
        });
      }, 250);
    };
  }, []);

  // 🔥 타이핑될 때마다 검색 강제 + 드롭다운 자동 오픈
  useEffect(() => {
    if (!ready) return;
    const has = q.trim().length > 0;
    setOpen(has);
    if (has) search(q);
    else setItems([]);
  }, [q, ready, search]);

  // 항목 선택
  const pick = (it) => {
    const place = {
      name: it.place_name,
      address: it.road_address_name || it.address_name || "",
      lat: parseFloat(it.y),
      lng: parseFloat(it.x),
    };
    setQ(place.name);
    setItems([]);
    setOpen(false);
    console.log("[MSI] picked:", place);
    onChange?.(place); // 부모로 전달
  };

  const clear = () => {
    setQ("");
    setItems([]);
    setOpen(false);
    onChange?.(null);
  };

  return (
    <div className={styles.field} style={{ position: "relative" }}>
      <label className={styles.label}>{label}</label>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          className={styles.input}
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (q) { setOpen(true); search(q); } }}
          disabled={disabled}
          style={{ position: "relative", zIndex: 3, pointerEvents: "auto" }}
          autoComplete="off"
        />
        {!!value && (
          <button
            type="button"
            className={styles.button}
            onMouseDown={(e) => e.preventDefault()} // blur 방지
            onClick={clear}
            disabled={disabled}
            style={{ whiteSpace: "nowrap" }}
          >
            지우기
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {open && (items.length > 0 || loading) && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 9999,                 // 🔥 최상위
            background: "#fff",
            border: "1px solid rgba(230,232,240,.7)",
            borderRadius: 8,
            marginTop: 6,
            maxHeight: 260,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(22,24,35,.12)",
          }}
          onMouseDown={(e) => e.preventDefault()} // 클릭 전에 blur되는 것 방지
        >
          {loading && <li style={{ padding: 12, fontSize: 14 }}>검색 중…</li>}
          {!loading &&
            items.map((r) => (
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

      {err && <p className={styles.error}>카카오 로드 오류: {err.message}</p>}
    </div>
  );
}
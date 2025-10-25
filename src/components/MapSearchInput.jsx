// src/components/MapSearchInput.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import useKakaoLoader from "../hooks/useKakaoLoader";
import styles from "../assets/styles/create&update.module.css";

/**
 * value: 선택된 장소 텍스트(문자열)
 * onChange: (place|null) => void
 * place = { name, address, lat, lng }
 */
export default function MapSearchInput({
  label = "장소",
  placeholder = "건물/장소명으로 검색",
  value = "",
  onChange,
  disabled = false,
}) {
  const { ready, err } = useKakaoLoader(process.env.REACT_APP_KAKAO_APP_KEY);

  const [q, setQ] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const placesRef = useRef(null);

  // Places 인스턴스 준비 (맵 없이도 생성 가능)
  useEffect(() => {
    if (!ready || placesRef.current) return;
    placesRef.current = new window.kakao.maps.services.Places();
    // console.log("[MSI] Places ready");
  }, [ready]);

  // 외부 value가 바뀌면 인풋 동기화
  useEffect(() => {
    setQ(value || "");
  }, [value]);

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
        placesRef.current.keywordSearch(kw, (data, status) => {
          setLoading(false);
          if (status === window.kakao.maps.services.Status.OK) {
            setItems(data.slice(0, 8));
          } else {
            setItems([]);
          }
        });
      }, 250);
    };
  }, []);

  // 타이핑될 때마다 검색 + 드롭다운 제어
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
    onChange?.(place);
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
          disabled={disabled || !ready}
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
            zIndex: 9999,               // 최상위로
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
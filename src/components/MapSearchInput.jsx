import { useEffect, useMemo, useRef, useState } from "react";
import useKakaoLoader from "../hooks/useKakaoLoader";
import styles from "../assets/styles/create&update.module.css";

export default function MapSearchInput({
  label = "장소",
  placeholder = "건물/장소명으로 검색",
  value = "",                // ✅ 문자열(선택된 장소 텍스트)
  onChange,                  // ✅ (placeObj|null) => void
  disabled = false,
  defaultCenter              // {lat,lng} optional
}) {
  const { ready, err } = useKakaoLoader(process.env.REACT_APP_KAKAO_APP_KEY);

  // 인풋에 보이는 텍스트(타이핑용)
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
  }, [ready, defaultCenter]);

  // 외부 value가 바뀌면 인풋 텍스트도 동기화
  useEffect(() => { setQ(value || ""); }, [value]);

  // 디바운스 검색
  const search = useMemo(() => {
    let t;
    return (kw) => {
      clearTimeout(t);
      if (!kw?.trim()) { setItems([]); return; }
      t = setTimeout(() => {
        if (!placesRef.current) return;
        setLoading(true);
        placesRef.current.keywordSearch(kw, (data, status) => {
          setLoading(false);
          // 디버깅 로그 (필요없으면 지워도 됨)
          // console.log("[Places]", kw, status, data?.length);
          if (status === window.kakao.maps.services.Status.OK) {
            setItems(data.slice(0, 8));
          } else {
            setItems([]);
          }
        });
      }, 250);
    };
  }, []);

  // 인풋 타이핑 시 검색
  useEffect(() => {
    if (!open) return;
    search(q);
  }, [q, open, search]);

  // 항목 클릭(여기가 "검색 결과 클릭")
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
    onChange?.(place); // ✅ 부모로 전달
  };

  const clear = () => {
    setQ("");
    setItems([]);
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
          onFocus={() => { setOpen(true); if (q) search(q); }}
          disabled={disabled}
          style={{ position: "relative", zIndex: 2, pointerEvents: "auto" }}
          autoComplete="off"
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

      {/* 검색 결과 드롭다운 */}
      {open && (items.length > 0 || loading) && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "#fff",
            border: "1px solid rgba(230,232,240,.7)",
            borderRadius: 8,
            marginTop: 6,
            maxHeight: 260,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(22,24,35,.12)",
          }}
        >
          {loading && <li style={{ padding: 12, fontSize: 14 }}>검색 중…</li>}
          {!loading &&
            items.map((r) => (
              <li
                key={r.id}
                onMouseDown={(e) => e.preventDefault()} // blur 방지
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
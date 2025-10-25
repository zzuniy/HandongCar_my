// src/components/MapSearchInput.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import useKakaoLoader from "../hooks/useKakaoLoader";
import styles from "../assets/styles/create&update.module.css";

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
  const [hl, setHl] = useState(-1);
  const [composing, setComposing] = useState(false);

  const placesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!ready || placesRef.current) return;
    placesRef.current = new window.kakao.maps.services.Places();
  }, [ready]);

  useEffect(() => {
    setQ(value || "");
  }, [value]);

  const search = useMemo(() => {
    let t;
    return (kw) => {
      clearTimeout(t);
      if (!kw?.trim() || !placesRef.current) {
        setItems([]);
        setHl(-1);
        return;
      }
      t = setTimeout(() => {
        setLoading(true);
        placesRef.current.keywordSearch(kw, (data, status) => {
          setLoading(false);
          if (status === window.kakao.maps.services.Status.OK) {
            const list = data.slice(0, 8);
            setItems(list);
            setHl(list.length ? 0 : -1);
          } else {
            setItems([]);
            setHl(-1);
          }
        });
      }, 180);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const has = q.trim().length > 0;
    setOpen(has);
    if (!composing) {
      if (has) search(q);
      else {
        setItems([]);
        setHl(-1);
      }
    }
  }, [q, composing, ready, search]);

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
    setHl(-1);
    onChange?.(place);
  };

  const clear = () => {
    setQ("");
    setItems([]);
    setOpen(false);
    setHl(-1);
    onChange?.(null);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (!open || items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHl((p) => (p + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHl((p) => (p - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hl >= 0) pick(items[hl]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // 인풋에 오른쪽 여백을 주기 위한 스타일 (X 버튼 자리)
  const inputStyle = useMemo(() => ({ paddingRight: 36 }), []);

  return (
    <div className={styles.field} style={{ position: "relative" }}>
      <label className={styles.label}>{label}</label>

      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (q.trim()) setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          disabled={disabled || !ready}
          style={inputStyle}
          autoComplete="off"
        />

        {/* 인풋 내부 X 버튼 */}
        {q && (
          <button
            type="button"
            aria-label="지우기"
            onMouseDown={(e) => e.preventDefault()} // blur 방지
            onClick={clear}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 24,
              height: 24,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontSize: 16,
              lineHeight: "22px",
              textAlign: "center",
              cursor: "pointer",
              opacity: 0.9,
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && (items.length > 0 || loading) && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10000,
            background: "#fff",
            border: "1px solid rgba(230,232,240,.9)",
            borderRadius: 10,
            marginTop: 6,
            maxHeight: 280,
            overflowY: "auto",
            boxShadow: "0 10px 28px rgba(22,24,35,.14)",
          }}
          onMouseDown={(e) => e.preventDefault()} // 목록 클릭 시 blur 방지
        >
          {loading && <li style={{ padding: 12, fontSize: 14 }}>검색 중…</li>}

          {!loading &&
            items.map((r, i) => {
              const active = i === hl;
              return (
                <li
                  key={r.id}
                  onMouseDown={() => pick(r)} // 1클릭 선택
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f3f4f6",
                    background: active ? "#f5f7ff" : "#fff",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{r.place_name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {r.road_address_name || r.address_name}
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      {err && <p className={styles.error}>카카오 로드 오류: {err.message}</p>}
    </div>
  );
}
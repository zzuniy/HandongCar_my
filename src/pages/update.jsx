// src/pages/update.jsx  (파일명은 네 프로젝트 네이밍에 맞춰서 사용)
// 기존: UpdatePage
import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api";
import styles from "../assets/styles/create&update.module.css";
import MapSearchInput from "../components/MapSearchInput";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pwOK, setPwOK] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    host_nickname: "",
    start_point: "",
    destination: "",
    start_lat: "",
    dest_lat: "",
    date: "",
    time: "",
    note: "",
  });

  const numericKeys = useMemo(() => ["total_people", "current_people"], []);
  const toInt = (v, fb = 0) => (Number.isFinite(+v) ? +v : fb);
  const under100 = (s) => (s?.length ?? 0) < 100;
  const nickUnder10 = (s) => (s?.length ?? 0) < 10;

  // StrictMode 이중 마운트 중복 방지
  const askedRef = useRef(false);

  const validate = (draft) => {
    const e = {
      host_nickname: "",
      start_point: "",
      destination: "",
      start_lat: "",
      dest_lat: "",
      date: "",
      time: "",
      note: "",
    };

    if (!draft.host_nickname || !nickUnder10(draft.host_nickname))
      e.host_nickname = "호스트 닉네임은 10자 미만이어야 합니다.";

    if (!draft.start_point) e.start_point = "출발지를 선택해 주세요.";
    else if (!under100(draft.start_point))
      e.start_point = "출발지는 100자 미만이어야 합니다.";

    if (!draft.destination) e.destination = "도착지를 선택해 주세요.";
    else if (!under100(draft.destination))
      e.destination = "도착지는 100자 미만이어야 합니다.";

    // 좌표 필수 (실제 목록 선택 여부 확인)
    if (draft.start_point && (draft.start_lat == null || draft.start_lng == null))
      e.start_lat = "출발지 좌표가 없습니다. 목록에서 장소를 선택하세요.";
    if (draft.destination && (draft.dest_lat == null || draft.dest_lng == null))
      e.dest_lat = "도착지 좌표가 없습니다. 목록에서 장소를 선택하세요.";

    if (!draft.date) e.date = "날짜를 선택하세요.";
    if (!draft.time) e.time = "시간을 선택하세요.";

    if (!under100(draft.note)) e.note = "비고는 100자 미만이어야 합니다.";

    setErrors(e);
    return e;
  };

  const askPassword = (pw) => {
    const input = window.prompt("이 게시글의 비밀번호를 입력하세요.");
    if (input === null) return false;
    if (String(input) === String(pw)) return true;
    alert("비밀번호가 올바르지 않습니다. 다시 시도하세요.");
    return askPassword(pw);
  };

  const fetchPost = async (force = false) => {
    if (!id) return;
    if (!force && (askedRef.current || pwOK)) return;
    askedRef.current = true;

    setLoading(true);
    setLoadError("");
    setPwOK(false);

    try {
      const { data } = await getPost(id);
      if (!("password" in data)) throw new Error("PASSWORD_MISSING");

      const ok = askPassword(String(data.password));
      if (!ok) {
        setLoadError("비밀번호 확인이 필요합니다. 아래 버튼으로 다시 시도하세요.");
        setForm(null);
        setPwOK(false);
        return;
      }

      const safe = {
        id: data.id ?? id,
        host_nickname: data.host_nickname ?? "",
        host_phone: data.host_phone ?? "",
        date: data.date ?? "",
        time: data.time ?? "",
        start_point: data.start_point ?? "",
        destination: data.destination ?? "",
        // 좌표 포함 (없으면 null)
        start_lat: data.start_lat ?? null,
        start_lng: data.start_lng ?? null,
        dest_lat: data.dest_lat ?? null,
        dest_lng: data.dest_lng ?? null,

        total_people: toInt(data.total_people, 2),
        total_time: data.total_time ?? "",
        current_people: toInt(data.current_people, 0),
        status: data.status ?? "모집 중",
        note: data.note ?? "",
      };

      setForm(safe);
      setPwOK(true);
      validate(safe);
    } catch (err) {
      const st = err?.response?.status;
      setLoadError(
        err?.message === "PASSWORD_MISSING"
          ? "비밀번호 필드가 없는 게시글입니다. 데이터 규칙을 확인하세요."
          : st === 404
          ? "해당 ID의 게시글이 없습니다. (404)"
          : "게시글을 불러올 수 없습니다."
      );
      console.error("[GET ERROR]", st, err?.message, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const draft = {
        ...f,
        [name]: numericKeys.includes(name)
          ? value === ""
            ? ""
            : toInt(value, 0)
          : value,
      };
      if (["host_nickname", "start_point", "destination", "note", "date", "time"].includes(name)) {
        validate(draft);
      }
      return draft;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pwOK) {
      alert("먼저 비밀번호를 확인하세요.");
      return;
    }
    if (!form) return;

    const eMap = validate(form);
    const invalidKey = Object.keys(eMap).find((k) => eMap[k]);
    if (invalidKey) {
      alert("입력값을 확인하세요.");
      document.getElementById(invalidKey)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const total = toInt(form.total_people, 2);
    const curr = toInt(form.current_people, 0);
    if (curr > total) {
      alert("현재 인원보다 작은 정원으로는 저장할 수 없습니다.");
      return;
    }

    const next = {
      ...form,
      total_people: total,
      current_people: curr,
      status: form.status ?? "모집 중",
    };
    // 혹시라도 nickname이 섞여 있으면 제거
    delete next.nickname;

    try {
      setSubmitting(true);
      await updatePost(form.id ?? id, next);
      alert("수정 완료!");
      navigate(`/detail/${form.id ?? id}`, { replace: true });
    } catch (err) {
      console.error("[PUT ERROR]", err?.response?.status, err?.message, err?.response?.data);
      alert("수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className={styles.card}>로딩 중…</div>
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell>
        <div className={styles.card} style={{ gap: 12 }}>
          <p style={{ margin: 0 }}>{loadError}</p>
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.btnGradient}`}
              onClick={() => fetchPost(true)}
            >
              비밀번호 다시 시도
            </button>
            <button className={styles.button} onClick={() => navigate(-1)}>
              뒤로가기
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!form || !pwOK) {
    return (
      <PageShell>
        <div className={styles.card}>비밀번호 확인이 필요합니다.</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className={styles.card}>
        <h1>같이카 수정</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* 1) 닉네임 / 전화번호 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="host_nickname" className={styles.label}>
                호스트 닉네임 (10자 미만)
              </label>
              <input
                id="host_nickname"
                className={`${styles.input} ${errors.host_nickname ? styles.error : ""}`}
                name="host_nickname"
                value={form.host_nickname}
                onChange={onChange}
                maxLength={10}
                disabled={submitting}
              />
              <span className={styles.counter}>{(form.host_nickname || "").length}/10</span>
              {errors.host_nickname && <p className={styles.error}>{errors.host_nickname}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="host_phone" className={styles.label}>전화번호</label>
              <input
                id="host_phone"
                className={styles.input}
                name="host_phone"
                value={form.host_phone}
                onChange={onChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* 2) 날짜 / 시간 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="date" className={styles.label}>날짜</label>
              <input
                id="date"
                className={`${styles.input} ${errors.date ? styles.error : ""}`}
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                disabled={submitting}
              />
              {errors.date && <p className={styles.error}>{errors.date}</p>}
            </div>
            <div className={styles.field}>
              <label htmlFor="time" className={styles.label}>시간</label>
              <input
                id="time"
                className={`${styles.input} ${errors.time ? styles.error : ""}`}
                type="time"
                name="time"
                value={form.time}
                onChange={onChange}
                disabled={submitting}
              />
              {errors.time && <p className={styles.error}>{errors.time}</p>}
            </div>
          </div>

          {/* 3) 출발지 / 도착지 (카카오 장소검색) */}
          <div id="start_point">
            <MapSearchInput
              label="출발지 (검색 후 선택)"
              value={form.start_point}
              placeholder="예: 한동대 정문 / 포항시청 / 주소"
              onChange={(place) => {
                if (!place) return;
                const picked = place.address || place.name || "";
                const trimmed = picked.slice(0, 100);
                const draft = {
                  ...form,
                  start_point: trimmed,
                  start_lat: place.lat,
                  start_lng: place.lng,
                };
                setForm(draft);
                validate(draft);
              }}
              disabled={submitting}
            />
            {(errors.start_point || errors.start_lat) && (
              <p className={styles.error}>{errors.start_point || errors.start_lat}</p>
            )}
          </div>

          <div id="destination">
            <MapSearchInput
              label="도착지 (검색 후 선택)"
              value={form.destination}
              placeholder="예: 포항시외버스터미널 / 포항공항 / 주소"
              onChange={(place) => {
                if (!place) return;
                const picked = place.address || place.name || "";
                const trimmed = picked.slice(0, 100);
                const draft = {
                  ...form,
                  destination: trimmed,
                  dest_lat: place.lat,
                  dest_lng: place.lng,
                };
                setForm(draft);
                validate(draft);
              }}
              disabled={submitting}
            />
            {(errors.destination || errors.dest_lat) && (
              <p className={styles.error}>{errors.destination || errors.dest_lat}</p>
            )}
          </div>

          {/* 4) 정원 */}
          <div className={styles.field}>
            <label htmlFor="total_people" className={styles.label}>정원</label>
            <select
              id="total_people"
              className={styles.select}
              name="total_people"
              value={form.total_people}
              onChange={onChange}
              disabled={submitting}
            >
              <option value={2}>2명</option>
              <option value={3}>3명</option>
              <option value={4}>4명</option>
            </select>
          </div>

          {/* 비고 */}
          <div className={styles.field}>
            <label htmlFor="note" className={styles.label}>비고 (100자 미만)</label>
            <textarea
              id="note"
              className={`${styles.textarea} ${errors.note ? styles.error : ""}`}
              name="note"
              rows={4}
              value={form.note}
              onChange={onChange}
              maxLength={100}
              disabled={submitting}
            />
            <span className={styles.counter}>{(form.note || "").length}/100</span>
            {errors.note && <p className={styles.error}>{errors.note}</p>}
          </div>

          {/* 제출 */}
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.btnGradient}`}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "수정 중…" : "수정 하기"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
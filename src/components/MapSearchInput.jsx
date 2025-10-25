// src/pages/create.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";
import styles from "../assets/styles/create&update.module.css";
import MapSearchInput from "../components/MapSearchInput";

export default function CreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    host_nickname: "",
    host_phone: "",
    date: "",
    time: "",
    start_point: "",
    destination: "",
    start_lat: null,
    start_lng: null,
    dest_lat: null,
    dest_lng: null,
    total_people: 2,
    total_time: "",
    current_people: 0,
    status: "모집 중",
    note: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    host_nickname: "",
    host_phone: "",
    start_point: "",
    destination: "",
    start_lat: "",
    dest_lat: "",
    date: "",
    time: "",
    note: "",
    password: "",
  });

  const numericKeys = useMemo(() => ["total_people", "current_people"], []);
  const toInt = (v, fb = 0) => (Number.isFinite(+v) ? +v : fb);
  const phoneRe = /^01[0-9]-\d{3,4}-\d{4}$/; // 010-1234-5678

  const validate = (f) => {
    const e = {
      host_nickname: "",
      host_phone: "",
      start_point: "",
      destination: "",
      start_lat: "",
      dest_lat: "",
      date: "",
      time: "",
      note: "",
      password: "",
    };
    const under100 = (s) => (s?.length ?? 0) < 100;
    const nickUnder10 = (s) => (s?.length ?? 0) < 10;

    if (!f.host_nickname) e.host_nickname = "닉네임을 입력하세요.";
    else if (!nickUnder10(f.host_nickname))
      e.host_nickname = "닉네임은 10자 미만이어야 합니다.";

    if (!f.host_phone) e.host_phone = "전화번호를 입력하세요.";
    else if (!phoneRe.test(f.host_phone))
      e.host_phone = "전화번호 형식(010-1234-5678)으로 입력하세요.";

    if (!f.start_point) e.start_point = "출발지를 선택해 주세요.";
    else if (!under100(f.start_point))
      e.start_point = "출발지는 100자 미만이어야 합니다.";

    if (!f.destination) e.destination = "도착지를 선택해 주세요.";
    else if (!under100(f.destination))
      e.destination = "도착지는 100자 미만이어야 합니다.";

    if (f.start_point && (f.start_lat == null || f.start_lng == null))
      e.start_lat = "출발지 좌표가 없습니다. 목록에서 장소를 선택하세요.";
    if (f.destination && (f.dest_lat == null || f.dest_lng == null))
      e.dest_lat = "도착지 좌표가 없습니다. 목록에서 장소를 선택하세요.";

    if (!f.date) e.date = "날짜를 선택하세요.";
    if (!f.time) e.time = "시간을 선택하세요.";

    if (!under100(f.note)) e.note = "비고는 100자 미만이어야 합니다.";
    if (!f.password) e.password = "비밀번호는 필수입니다.";

    setErrors(e);
    return e; // 에러 맵
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const draft = {
        ...prev,
        [name]: numericKeys.includes(name)
          ? value === ""
            ? ""
            : toInt(value, 0)
          : value,
      };
      if (
        [
          "host_nickname",
          "host_phone",
          "start_point",
          "destination",
          "note",
          "password",
          "date",
          "time",
        ].includes(name)
      ) {
        validate(draft);
      }
      return draft;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate(form);
    const firstInvalid = Object.keys(eMap).find((k) => eMap[k]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const total = toInt(form.total_people, 2);
    const curr = toInt(form.current_people, 0);
    if (curr > total) {
      // 필요하면 total_people에 별도 에러 스타일을 걸어도 됨
      return;
    }

    const payload = {
      ...form,
      total_people: total,
      current_people: curr,
      status: "모집 중",
    };
    delete payload.nickname;

    try {
      setSubmitting(true);
      const { data } = await createPost(payload);
      navigate(`/detail/${data?.id ?? ""}`, { replace: true });
    } catch (err) {
      console.error("[POST ERROR]", err?.response?.status, err?.message, err?.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const errStyle = {
    border: "1.5px solid #e46a6a",
    boxShadow: "0 0 4px rgba(228,106,106,.25)",
  };

  return (
    <PageShell>
      <div className={styles.card}>
        <h1>같이카 등록</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* 1) 닉네임 / 전화번호 */}
          <div className={styles.row2}>
            <div className={styles.field} id="host_nickname">
              <label htmlFor="host_nickname" className={styles.label}>
                닉네임 (10자 미만)
              </label>
              <input
                id="host_nickname"
                className={styles.input}
                name="host_nickname"
                value={form.host_nickname}
                onChange={onChange}
                maxLength={10}
                disabled={submitting}
                style={errors.host_nickname ? errStyle : {}}
              />
              <span className={styles.counter}>
                {(form.host_nickname || "").length}/10
              </span>
              {errors.host_nickname && (
                <p className={styles.error}>{errors.host_nickname}</p>
              )}
            </div>

            <div className={styles.field} id="host_phone">
              <label htmlFor="host_phone" className={styles.label}>
                전화번호
              </label>
              <input
                id="host_phone"
                className={styles.input}
                name="host_phone"
                value={form.host_phone}
                onChange={onChange}
                placeholder="010-1234-5678"
                disabled={submitting}
                style={errors.host_phone ? errStyle : {}}
              />
              {errors.host_phone && (
                <p className={styles.error}>{errors.host_phone}</p>
              )}
            </div>
          </div>

          {/* 2) 날짜 / 시간 */}
          <div className={styles.row2}>
            <div className={styles.field} id="date">
              <label htmlFor="date" className={styles.label}>
                날짜
              </label>
              <input
                id="date"
                className={styles.input}
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                disabled={submitting}
                style={errors.date ? errStyle : {}}
              />
              {errors.date && <p className={styles.error}>{errors.date}</p>}
            </div>
            <div className={styles.field} id="time">
              <label htmlFor="time" className={styles.label}>
                시간
              </label>
              <input
                id="time"
                className={styles.input}
                type="time"
                name="time"
                value={form.time}
                onChange={onChange}
                disabled={submitting}
                style={errors.time ? errStyle : {}}
              />
              {errors.time && <p className={styles.error}>{errors.time}</p>}
            </div>
          </div>

          {/* 3) 출발지 / 도착지 */}
          <div id="start_point">
            <MapSearchInput
              label="출발지 (검색 후 선택)"
              value={form.start_point}
              placeholder="예: 한동대 정문 / 포항시청 / 주소"
              onChange={(place) => {
                if (!place) return;
                const picked = place.address || place.name || "";
                const draft = {
                  ...form,
                  start_point: picked.slice(0, 100),
                  start_lat: place.lat,
                  start_lng: place.lng,
                };
                setForm(draft);
                validate(draft);
              }}
              disabled={false}
              invalid={!!(errors.start_point || errors.start_lat)}
              error={errors.start_point || errors.start_lat}
            />
          </div>

          <div id="destination">
            <MapSearchInput
              label="도착지 (검색 후 선택)"
              value={form.destination}
              placeholder="예: 포항시외버스터미널 / 포항공항 / 주소"
              onChange={(place) => {
                if (!place) return;
                const picked = place.address || place.name || "";
                const draft = {
                  ...form,
                  destination: picked.slice(0, 100),
                  dest_lat: place.lat,
                  dest_lng: place.lng,
                };
                setForm(draft);
                validate(draft);
              }}
              disabled={submitting}
              invalid={!!(errors.destination || errors.dest_lat)}
              error={errors.destination || errors.dest_lat}
            />
          </div>

          {/* 4) 정원 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="total_people" className={styles.label}>
                정원
              </label>
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
          </div>

          {/* 비고 */}
          <div className={styles.field} id="note">
            <label htmlFor="note" className={styles.label}>
              비고 (100자 미만)
            </label>
            <textarea
              id="note"
              className={styles.textarea}
              name="note"
              rows={4}
              value={form.note}
              onChange={onChange}
              maxLength={100}
              disabled={submitting}
              style={errors.note ? errStyle : {}}
            />
            <span className={styles.counter}>
              {(form.note || "").length}/100
            </span>
            {errors.note && <p className={styles.error}>{errors.note}</p>}
          </div>

          {/* 비밀번호 */}
          <div className={styles.field} id="password">
            <label htmlFor="password" className={styles.label}>
              비밀번호 (필수)
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              disabled={submitting}
              style={errors.password ? errStyle : {}}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>

          {/* 제출 */}
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.btnGradient}`}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "등록 중…" : "등록 하기"}
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
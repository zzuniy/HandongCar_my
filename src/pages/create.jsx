// src/pages/create.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";
import styles from "../assets/styles/create&update.module.css";
import MapSearchInput from "../components/MapSearchInput";

export default function CreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // 초기 상태
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
    password: ""
  });

  const [errors, setErrors] = useState({
    host_nickname: "",
    start_point: "",
    destination: "",
    note: "",
    password: ""
  });

  const numericKeys = useMemo(() => ["total_people", "current_people"], []);
  const toInt = (v, fb = 0) => (Number.isFinite(+v) ? +v : fb);

  const validate = (f) => {
    const e = {
      host_nickname: "",
      start_point: "",
      destination: "",
      note: "",
      password: ""
    };

    const under100 = (s) => (s?.length ?? 0) < 100;
    const nickUnder10 = (s) => (s?.length ?? 0) < 10;

    if (!f.host_nickname || !nickUnder10(f.host_nickname))
      e.host_nickname = "닉네임은 10자 미만이어야 합니다.";

    if (!f.start_point) e.start_point = "출발지를 선택해 주세요.";
    else if (!under100(f.start_point))
      e.start_point = "출발지는 100자 미만이어야 합니다.";

    if (!f.destination) e.destination = "도착지를 선택해 주세요.";
    else if (!under100(f.destination))
      e.destination = "도착지는 100자 미만이어야 합니다.";

    if (!under100(f.note)) e.note = "비고는 100자 미만이어야 합니다.";
    if (!f.password) e.password = "비밀번호는 필수입니다.";

    setErrors(e);
    return Object.values(e).every((v) => !v);
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
          : value
      };
      if (
        ["host_nickname", "start_point", "destination", "note", "password"].includes(
          name
        )
      )
        validate(draft);
      return draft;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) {
      alert("입력값을 확인하세요.");
      return;
    }

    const total = toInt(form.total_people, 2);
    const curr = toInt(form.current_people, 0);
    if (curr > total) {
      alert("현재 인원이 정원을 초과했습니다.");
      return;
    }

    const next = {
      ...form,
      total_people: total,
      current_people: curr,
      status: "모집 중",
      start_lat: form.start_lat ?? null,
      start_lng: form.start_lng ?? null,
      dest_lat: form.dest_lat ?? null,
      dest_lng: form.dest_lng ?? null
    };

    try {
      setSubmitting(true);
      const { data } = await createPost(next);
      alert("등록 완료!");
      navigate(`/detail/${data?.id ?? ""}`, { replace: true });
    } catch (err) {
      console.error("[POST ERROR]", err?.response?.status, err?.message, err?.response?.data);
      alert("등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className={styles.card}>
        <h1>같이카 등록</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* 1) 닉네임 / 전화번호 */}
          <div className={styles.row2}>
            <div className={styles.field}>
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
              />
              <span className={styles.counter}>
                {(form.host_nickname || "").length}/10
              </span>
              {errors.host_nickname && (
                <p className={styles.error}>{errors.host_nickname}</p>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="host_phone" className={styles.label}>
                전화번호
              </label>
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
              />
            </div>
            <div className={styles.field}>
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
              />
            </div>
          </div>

          {/* 3) 출발지 / 도착지 */}
          <MapSearchInput
            label="출발지 (검색 후 선택)"
            value={form.start_point}
            placeholder="예: 한동대 정문 / 포항시청 / 주소"
            onSelect={(p) => {
              const picked = p.roadAddress || p.address || p.name || "";
              const trimmed = picked.slice(0, 100);
              const draft = {
                ...form,
                start_point: trimmed,
                start_lat: p.lat,
                start_lng: p.lng
              };
              setForm(draft);
              validate(draft);
            }}
            classNames={{
              wrapper: styles.field,
              label: styles.label,
              input: styles.input,
              list: styles.dropdown,
              item: styles.dropdownItem,
              hint: styles.hint,
              error: styles.error
            }}
            disabled={false}
            error={errors.start_point}
          />

          <MapSearchInput
            label="도착지 (검색 후 선택)"
            value={form.destination}
            placeholder="예: 포항시외버스터미널 / 포항공항 / 주소"
            onSelect={(p) => {
              const picked = p.roadAddress || p.address || p.name || "";
              const trimmed = picked.slice(0, 100);
              const draft = {
                ...form,
                destination: trimmed,
                dest_lat: p.lat,
                dest_lng: p.lng
              };
              setForm(draft);
              validate(draft);
            }}
            classNames={{
              wrapper: styles.field,
              label: styles.label,
              input: styles.input,
              list: styles.dropdown,
              item: styles.dropdownItem,
              hint: styles.hint,
              error: styles.error
            }}
            disabled={submitting}
            error={errors.destination}
          />

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
          <div className={styles.field}>
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
            />
            <span className={styles.counter}>
              {(form.note || "").length}/100
            </span>
            {errors.note && <p className={styles.error}>{errors.note}</p>}
          </div>

          {/* 비밀번호 */}
          <div className={styles.field}>
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
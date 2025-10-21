// src/pages/update.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api";
import styles from "../assets/styles/create&update.module.css";

export default function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pwOK, setPwOK] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({ start_point: "", destination: "", note: "" });

  const numericKeys = useMemo(() => ["total_people", "current_people"], []);

  // ----- 유틸 -----
  const toInt = (val, fallback = 0) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  const validate = (draft) => {
    const e = { start_point: "", destination: "", note: "" };
    const under100 = (s) => (s?.length ?? 0) < 100;

    if (!under100(draft.start_point)) e.start_point = "출발지는 100자 미만이어야 합니다.";
    if (!under100(draft.destination)) e.destination = "도착지는 100자 미만이어야 합니다.";
    if (!under100(draft.note)) e.note = "비고는 100자 미만이어야 합니다.";

    setErrors(e);
    return !e.start_point && !e.destination && !e.note;
  };

  // ----- 비번 prompt (무제한) -----
  const promptPasswordUntilMatch = (passwordFromServer) => {
    // 비번 확인 루틴: 취소 누르면 false, 맞으면 true, 틀리면 계속
    // 즉시 프롬프트 1회
    // 무한 루프는 UX상 부담이라, 틀릴 때마다 다시 띄우되 "취소"하면 빠져나오게.
    // 여기선 한 번 틀리면 while로 재귀 대체
    // (브라우저가 prompt 연속 호출을 막는 환경도 있어, 틀릴 때 재호출 1~2회만 시도하고
    //  나머지는 화면의 "다시 시도" 버튼으로 가는 걸 권장)
    // 간단히 1회만 묻고, 나머지는 화면에서 "다시 시도" 하도록 설계.
    const input = window.prompt("이 게시글의 비밀번호를 입력하세요.");
    if (input === null) return false;
    if (String(input) === String(passwordFromServer)) return true;
    alert("비밀번호가 올바르지 않습니다. 다시 시도하세요.");
    return promptPasswordUntilMatch(passwordFromServer);
  };

  // ----- 로딩 + 선(先)비번확인 -----
  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    setLoadError("");
    setPwOK(false);

    try {
      const { data } = await getPost(id);

      // 비번 없이 저장된 글은 없다는 전제. 없으면 규칙 위반.
      if (!("password" in data)) {
        throw new Error("PASSWORD_MISSING");
      }

      // 먼저 비번 prompt로 검증
      const ok = promptPasswordUntilMatch(String(data.password));
      if (!ok) {
        // 사용자가 취소 → 수정 페이지 진입 차단. 뒤로 가기 or 가만히.
        setPwOK(false);
        setForm(null);
        setLoadError("비밀번호 확인이 필요합니다. 아래 버튼으로 다시 시도하세요.");
        return;
      }

      const safe = {
        id: data.id ?? id,
        date: data.date ?? "",
        time: data.time ?? "",
        start_point: data.start_point ?? "",
        destination: data.destination ?? "",
        total_people: toInt(data.total_people, 1),
        current_people: toInt(data.current_people, 0),
        host_phone: data.host_phone ?? "",
        total_time: data.total_time ?? "",
        status: data.status ?? "모집 중",
        note: data.note ?? "",
        // password는 폼에는 보관하지 않음(클라 비교는 이미 완료)
      };
      setForm(safe);
      setPwOK(true);
      validate(safe);
    } catch (err) {
      const status = err?.response?.status;
      if (err?.message === "PASSWORD_MISSING") {
        setLoadError("비밀번호가 없는 게시글입니다. 데이터 규칙을 확인하세요.");
      } else {
        setLoadError(status === 404 ? "해당 ID의 게시글이 없습니다. (404)" : "게시글을 불러올 수 없습니다.");
      }
      console.error("[GET ERROR]", status, err?.message, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ----- 입력 변경 + 실시간 검증 -----
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const draft = {
        ...f,
        [name]: numericKeys.includes(name) ? (value === "" ? "" : toInt(value, 0)) : value,
      };
      // 라이브 검증
      if (["start_point", "destination", "note"].includes(name)) {
        validate(draft);
      }
      return draft;
    });
  };

  // ----- 제출 -----
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pwOK) return alert("먼저 비밀번호를 확인하세요.");
    if (!form) return;

    // 최종 검증
    const isValid = validate(form);
    if (!isValid) {
      alert("입력값을 확인하세요.");
      return;
    }

    const total_people = toInt(form.total_people, 1);
    const current_people = toInt(form.current_people, 0);
    if (current_people > total_people) {
      alert("현재 인원이 정원을 초과했습니다.");
      return;
    }

    const next = {
      ...form,
      total_people,
      current_people,
      status: current_people >= total_people ? "마감" : (form.status || "모집 중"),
    };

    setSubmitting(true);
    try {
      await updatePost(form.id ?? id, next); // 클라만: 서버 비번검증 없음
      alert("수정 완료!");
      // navigate(`/detail/${form.id}`);
    } catch (err) {
      console.error("[PUT ERROR]", err?.response?.status, err?.message, err?.response?.data);
      alert("수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // ----- UI -----
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
              onClick={fetchPost}
              type="button"
            >
              비밀번호 다시 시도
            </button>
            <button
              className={styles.button}
              type="button"
              onClick={() => navigate(-1)}
            >
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
          {/* 날짜/시간 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="date" className={styles.label}>날짜</label>
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
              <label htmlFor="time" className={styles.label}>시간</label>
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

          {/* 출발지 */}
          <div className={styles.field}>
            <label htmlFor="start_point" className={styles.label}>출발지 (100자 미만)</label>
            <input
              id="start_point"
              className={styles.input}
              name="start_point"
              value={form.start_point}
              onChange={onChange}
              maxLength={99}
              aria-describedby="start_point_help"
              disabled={submitting}
            />
            <div id="start_point_help" className={styles.help}>
              {form.start_point.length}/99
              {errors.start_point && <span className={styles.error}> · {errors.start_point}</span>}
            </div>
          </div>

          {/* 도착지 */}
          <div className={styles.field}>
            <label htmlFor="destination" className={styles.label}>도착지 (100자 미만)</label>
            <input
              id="destination"
              className={styles.input}
              name="destination"
              value={form.destination}
              onChange={onChange}
              maxLength={99}
              aria-describedby="destination_help"
              disabled={submitting}
            />
            <div id="destination_help" className={styles.help}>
              {form.destination.length}/99
              {errors.destination && <span className={styles.error}> · {errors.destination}</span>}
            </div>
          </div>

          {/* 정원/현재 */}
          <div className={styles.row2}>
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
                <option value={1}>1명</option>
                <option value={2}>2명</option>
                <option value={3}>3명</option>
                <option value={4}>4명</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="current_people" className={styles.label}>현재 인원</label>
              <input
                id="current_people"
                className={styles.input}
                type="number"
                min="0"
                name="current_people"
                value={form.current_people}
                onChange={onChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* 호스트 연락처 / 소요시간 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="host_phone" className={styles.label}>호스트 연락처</label>
              <input
                id="host_phone"
                className={styles.input}
                name="host_phone"
                value={form.host_phone}
                onChange={onChange}
                disabled={submitting}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="total_time" className={styles.label}>소요시간</label>
              <input
                id="total_time"
                className={styles.input}
                name="total_time"
                value={form.total_time}
                onChange={onChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* 상태 */}
          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>상태</label>
            <select
              id="status"
              className={styles.select}
              name="status"
              value={form.status}
              onChange={onChange}
              disabled={submitting}
            >
              <option value="모집 중">모집 중</option>
              <option value="마감">마감</option>
            </select>
          </div>

          {/* 비고 */}
          <div className={styles.field}>
            <label htmlFor="note" className={styles.label}>비고 (100자 미만)</label>
            <textarea
              id="note"
              className={styles.textarea}
              name="note"
              value={form.note}
              onChange={onChange}
              maxLength={99}
              rows={4}
              aria-describedby="note_help"
              disabled={submitting}
            />
            <div id="note_help" className={styles.help}>
              {form.note.length}/99
              {errors.note && <span className={styles.error}> · {errors.note}</span>}
            </div>
          </div>

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
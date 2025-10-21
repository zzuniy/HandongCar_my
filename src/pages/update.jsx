// src/pages/update.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost, updatePost } from "../api";
import styles from "../assets/styles/create&update.module.css";

export default function UpdatePage() {
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pwOK, setPwOK] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numericKeys = useMemo(() => ["total_people", "current_people"], []);

  // ===== 게시글 로딩 =====
  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    setLoadError("");
    setPwOK(false);
    setPwInput("");
    setPwMsg("");

    try {
      const res = await getPost(id);
      const data = res?.data ?? res;

      // 모든 글에 비번이 있다는 전제. 없으면 에러 처리.
      if (!data?.password) {
        throw Object.assign(new Error("PASSWORD_REQUIRED"), { code: "NO_PASSWORD" });
      }

      const safe = {
        id: data?.id ?? id,
        date: data?.date ?? "",
        time: data?.time ?? "",
        start_point: data?.start_point ?? "",
        destination: data?.destination ?? "",
        total_people: toInt(data?.total_people, 1),
        current_people: toInt(data?.current_people, 0),
        host_phone: data?.host_phone ?? "",
        total_time: data?.total_time ?? "",
        status: data?.status ?? "모집 중",
        note: data?.note ?? "",
        password: String(data.password), // 비교용(클라 검증이 완전한 보안은 아님)
      };

      setForm(safe);
    } catch (err) {
      const status = err?.response?.status;
      if (err?.code === "NO_PASSWORD") {
        setLoadError("이 게시글에는 비밀번호가 없어요. 데이터 규칙과 달라 수정 불가.");
      } else {
        setLoadError(
          status === 404 ? "해당 ID의 게시글을 찾을 수 없습니다. (404)" : "게시글을 불러오는 중 오류가 발생했습니다."
        );
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

  // ===== 비밀번호 확인 (무제한 시도) =====
  const verifyPassword = () => {
    if (!form) return;
    if (pwInput === form.password) {
      setPwOK(true);
      setPwMsg("비밀번호 일치. 이제 수정할 수 있어요.");
    } else {
      setPwOK(false);
      setPwMsg("비밀번호가 올바르지 않습니다.");
    }
  };

  // ===== 입력값 변경 =====
  const onChange = (e) => {
    const { name, value } = e.target;
    if (numericKeys.includes(name)) {
      setForm((f) => ({ ...f, [name]: value === "" ? "" : toInt(value, 0) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // ===== 제출 =====
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pwOK) return alert("먼저 비밀번호를 확인하세요.");
    if (!form) return;

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
      await updatePost(form.id ?? id, next);
      alert("수정 완료!");
      // 필요 시 라우팅: navigate(`/detail/${form.id}`);
    } catch (err) {
      console.error("[PUT ERROR]", err?.response?.status, err?.message, err?.response?.data);
      alert("수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== UI =====
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
              type="button"
              onClick={fetchPost}
            >
              다시 시도
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!form) {
    return (
      <PageShell>
        <div className={styles.card}>데이터가 없습니다.</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className={styles.card}>
        <h1>같이카 수정</h1>

        {/* 비밀번호 입력 영역: 무제한 시도 */}
        <div className={styles.form} style={{ marginBottom: 12 }}>
          <div className={styles.row2}>
            <input
              className={styles.input}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              disabled={submitting}
            />
            <button
              type="button"
              className={`${styles.button} ${styles.btnGradient}`}
              onClick={verifyPassword}
              disabled={submitting}
            >
              확인
            </button>
          </div>
          {pwMsg && (
            <p
              style={{
                marginTop: 6,
                fontSize: 14,
                color: pwOK ? "#2e7d32" : "#d32f2f",
              }}
            >
              {pwOK ? "✓ " : "✕ "}{pwMsg}
            </p>
          )}
        </div>

        {/* 수정 폼 */}
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.row2}>
            <input
              className={styles.input}
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              disabled={!pwOK || submitting}
            />
            <input
              className={styles.input}
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              disabled={!pwOK || submitting}
            />
          </div>

          <input
            className={styles.input}
            name="start_point"
            placeholder="출발지"
            value={form.start_point}
            onChange={onChange}
            disabled={!pwOK || submitting}
          />
          <input
            className={styles.input}
            name="destination"
            placeholder="도착지"
            value={form.destination}
            onChange={onChange}
            disabled={!pwOK || submitting}
          />

          <select
            className={styles.select}
            name="total_people"
            value={form.total_people}
            onChange={onChange}
            disabled={!pwOK || submitting}
          >
            <option value={1}>1명</option>
            <option value={2}>2명</option>
            <option value={3}>3명</option>
            <option value={4}>4명</option>
          </select>

          <input
            className={styles.input}
            type="number"
            min="0"
            name="current_people"
            value={form.current_people}
            onChange={onChange}
            disabled={!pwOK || submitting}
          />

          <input
            className={styles.input}
            name="host_phone"
            placeholder="호스트 연락처"
            value={form.host_phone}
            onChange={onChange}
            disabled={!pwOK || submitting}
          />

          <input
            className={styles.input}
            name="total_time"
            placeholder="소요시간"
            value={form.total_time}
            onChange={onChange}
            disabled={!pwOK || submitting}
          />

          <select
            className={styles.select}
            name="status"
            value={form.status}
            onChange={onChange}
            disabled={!pwOK || submitting}
          >
            <option value="모집 중">모집 중</option>
            <option value="마감">마감</option>
          </select>

          <textarea
            className={styles.textarea}
            name="note"
            placeholder="비고"
            value={form.note}
            onChange={onChange}
            disabled={!pwOK || submitting}
          />

          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.btnGradient}`}
              type="submit"
              disabled={!pwOK || submitting}
            >
              {submitting ? "수정 중…" : "수정 하기"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

// ===== 유틸/레이아웃 =====
function toInt(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}
function PageShell({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
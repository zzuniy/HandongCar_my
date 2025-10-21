import { useEffect, useState } from "react";
import { getPost, updatePost } from "../api";
import { useParams } from "react-router-dom";

export default function UpdatePage(){
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pwInput, setPwInput] = useState("");
  const [pwOK, setPwOK] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data, config } = await getPost(id);
        console.log("[GET]", config.baseURL + config.url);
        setForm(data);
      } catch (err) {
        console.error("[GET ERROR]", err?.config?.baseURL + err?.config?.url, err?.response?.status, err?.response?.data);
        alert("게시글을 불러올 수 없습니다. 콘솔을 확인하세요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const checkPw = () => {
    if (!form?.password) {
      alert("이 게시글에 비밀번호가 없습니다. (정책상 없어야 함)");
      return;
    }
    if (pwInput === form.password) {
      setPwOK(true);
      alert("비밀번호 확인 완료. 수정 가능합니다.");
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name.includes("people") ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pwOK) return alert("먼저 비밀번호를 확인하세요.");
    try {
      await updatePost(id, form);
      alert("수정 완료!");
    } catch (err) {
      console.error("[PUT ERROR]", err?.config?.baseURL + err?.config?.url, err?.response?.status, err?.response?.data);
      alert("수정에 실패했습니다. 콘솔을 확인하세요.");
    }
  };

  if (loading || !form)
    return (
      <div className="page">
        <div className="container">
          <div className="card">로딩 중…</div>
        </div>
      </div>
    );

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>같이카 수정</h1>

          {/* 비밀번호 확인 바 */}
          <div className="row-2" style={{ alignItems: "center" }}>
            <input
              className="input"
              type="password"
              placeholder="비밀번호 입력"
              value={pwInput}
              onChange={(e)=>setPwInput(e.target.value)}
            />
            <button
              type="button"
              className="button btn-gradient"
              onClick={checkPw}
              disabled={pwOK}
            >
              {pwOK ? "확인됨" : "비밀번호 확인"}
            </button>
          </div>

          <form className="form" onSubmit={onSubmit}>
            <div className="row-2">
              <input className="input" type="date" name="date" value={form.date || ""} onChange={onChange} disabled={!pwOK}/>
              <input className="input" type="time" name="time" value={form.time || ""} onChange={onChange} disabled={!pwOK}/>
            </div>

            <input className="input" name="start_point" value={form.start_point || ""} onChange={onChange} disabled={!pwOK}/>
            <input className="input" name="destination" value={form.destination || ""} onChange={onChange} disabled={!pwOK}/>

            <select className="select" name="total_people" value={form.total_people ?? 1} onChange={onChange} disabled={!pwOK}>
              <option value={1}>1명</option>
              <option value={2}>2명</option>
              <option value={3}>3명</option>
              <option value={4}>4명</option>
            </select>

            <input className="input" type="number" min="0" name="current_people" value={form.current_people ?? 0} onChange={onChange} disabled={!pwOK}/>
            <input className="input" name="host_phone" value={form.host_phone || ""} onChange={onChange} disabled={!pwOK}/>
            <input className="input" name="total_time" value={form.total_time || ""} onChange={onChange} disabled={!pwOK}/>
            <select className="select" name="status" value={form.status || "모집 중"} onChange={onChange} disabled={!pwOK}>
              <option>모집 중</option>
              <option>마감</option>
            </select>
            <textarea className="textarea" name="note" value={form.note || ""} onChange={onChange} disabled={!pwOK}/>

            <div className="actions">
              <button className="button btn-gradient" type="submit" disabled={!pwOK}>수정 하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
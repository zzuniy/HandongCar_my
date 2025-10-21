import { useEffect, useState } from "react";
import { getPost, updatePost } from "../api";
import { useParams } from "react-router-dom";

export default function UpdatePage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [pwOK, setPwOK] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await getPost(id);
      setForm(data);
    })();
  }, [id]);

  const checkPw = () => {
    if (!form?.password) { setPwOK(true); return alert("비밀번호 미설정 게시글입니다. 바로 수정 가능합니다."); }
    const input = prompt("비밀번호를 입력하세요");
    if (input === form.password) { setPwOK(true); alert("확인되었습니다. 수정 가능해요."); }
    else { alert("비밀번호가 올바르지 않습니다."); }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name.includes("people") ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pwOK) return alert("먼저 비밀번호를 확인하세요.");
    await updatePost(id, form);
    alert("수정 완료!");
  };

  if (!form) return <div className="container"><div className="card">로딩 중…</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h1>같이카 수정</h1>

        <button className="button" onClick={checkPw} disabled={pwOK} style={{ marginBottom: 12 }}>
          {pwOK ? "비밀번호 확인 완료" : "비밀번호 확인"}
        </button>

        <form className="form" onSubmit={onSubmit}>
          <div className="row-2">
            <input className="input" name="date" value={form.date || ""} onChange={onChange}/>
            <input className="input" name="time" value={form.time || ""} onChange={onChange}/>
          </div>

          <input className="input" name="start_point" value={form.start_point || ""} onChange={onChange}/>
          <input className="input" name="destination" value={form.destination || ""} onChange={onChange}/>

          <select className="select" name="total_people" value={form.total_people ?? 1} onChange={onChange}>
            <option value={1}>1명</option>
            <option value={2}>2명</option>
            <option value={3}>3명</option>
            <option value={4}>4명</option>
          </select>

          <input className="input" type="number" min="0" name="current_people" value={form.current_people ?? 0} onChange={onChange}/>
          <input className="input" name="host_phone" value={form.host_phone || ""} onChange={onChange}/>
          <input className="input" name="total_time" value={form.total_time || ""} onChange={onChange}/>
          <select className="select" name="status" value={form.status || "모집 중"} onChange={onChange}>
            <option>모집 중</option>
            <option>마감</option>
          </select>
          <textarea className="textarea" name="note" value={form.note || ""} onChange={onChange} />

          <div className="toolbar">
            <button className="button btn-gradient" type="submit" disabled={!pwOK}>수정 하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}
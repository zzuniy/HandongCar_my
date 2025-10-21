import { useState } from "react";
import { createPost } from "../api";
import { useNavigate } from "react-router-dom";

const INIT = {
  date: "", time: "",
  start_point: "", destination: "",
  total_people: 1,
  host_phone: "",
  note: "",
  password: "",
  current_people: 0,
  status: "모집 중",
  total_time: "",
  created_at: new Date().toISOString(),
  joined: false
};

export default function CreatePage() {
  const [form, setForm] = useState(INIT);
  const nav = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    const v = name.includes("people") ? Number(value) : value;
    setForm((f) => ({ ...f, [name]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // 필수 검증
    const req = ["date", "time", "start_point", "destination", "total_people", "host_phone"];
    const miss = req.filter((k) => !String(form[k]).trim());
    if (miss.length) return alert("필수 항목을 모두 입력하세요.");

    const { data } = await createPost(form);
    alert(`생성 완료. 비밀번호 저장됨: ${form.password ? "예" : "아니오"}`);
    nav(`/update/${data.id}`); // 바로 수정 페이지로 이동
  };

  return (
    <div className="container">
      <div className="card">
        <h1>같이카 생성</h1>
        <form className="form" onSubmit={onSubmit}>
          <div className="row-2">
            <input className="input" name="date" placeholder="YYYY-MM-DD" value={form.date} onChange={onChange}/>
            <input className="input" name="time" placeholder="HH:mm" value={form.time} onChange={onChange}/>
          </div>

          <input className="input" name="start_point" placeholder="출발지 (예: 한동대 정문)" value={form.start_point} onChange={onChange}/>
          <input className="input" name="destination" placeholder="도착지 (예: 포항역)" value={form.destination} onChange={onChange}/>

          <select className="select" name="total_people" value={form.total_people} onChange={onChange}>
            <option value={1}>1명</option>
            <option value={2}>2명</option>
            <option value={3}>3명</option>
            <option value={4}>4명</option>
          </select>
          <div className="hint">* 전체 인원은 최대 4명까지 가능합니다.</div>

          <input className="input" name="host_phone" placeholder="연락처 (예: 010-1234-5678)" value={form.host_phone} onChange={onChange}/>
          <textarea className="textarea" name="note" placeholder="적재 여부/특이 사항" value={form.note} onChange={onChange} />

          <input className="input" name="password" placeholder="수정 비밀번호(선택)" value={form.password} onChange={onChange} />

          <div className="toolbar">
            <button className="button btn-gradient" type="submit">생성 하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}
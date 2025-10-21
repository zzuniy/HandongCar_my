import { useState } from "react";
import { createPost } from "../api";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/create&update.module.css";

const INIT = {
  date:"", time:"",
  start_point:"", destination:"",
  total_people:1, host_phone:"",
  note:"", current_people:0,
  status:"모집 중", total_time:"",
  created_at:new Date().toISOString(), joined:false,
};

export default function CreatePage(){
  const [form, setForm] = useState(INIT);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const nav = useNavigate();

  const onChange = (e)=>{
    const {name, value} = e.target;
    setForm(f => ({...f, [name]: name.includes("people") ? Number(value) : value}));
  };

  const onSubmit = async (e)=>{
    e.preventDefault();

    const req = ["date","time","start_point","destination","total_people","host_phone"];
    const miss = req.filter(k => !String(form[k]).trim());
    if (miss.length) return alert("필수 항목을 모두 입력하세요.");

    const phoneOk = /^01[016789]-?\d{3,4}-?\d{4}$/.test(form.host_phone);
    if (!phoneOk) return alert("연락처 형식을 확인하세요. 예) 010-1234-5678");

    if (!pw.trim()) return alert("비밀번호를 입력하세요.");
    if (pw.length < 4 || pw.length > 12) return alert("비밀번호는 4~12자입니다.");
    if (pw !== pw2) return alert("비밀번호가 일치하지 않습니다.");

    try{
      const res = await createPost({...form, password: pw});
      const newId = res?.data?.id;
      alert("게시글이 생성되었습니다!");
      if (newId) nav(`/update/${newId}`);
    }catch(err){
      console.error("[POST ERROR]", err?.config?.baseURL + err?.config?.url, err?.response?.status, err?.response?.data);
      alert("생성에 실패했습니다. 콘솔을 확인하세요.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>같이카 생성</h1>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.row2}>
              <input className={styles.input} type="date" name="date" value={form.date} onChange={onChange}/>
              <input className={styles.input} type="time" name="time" value={form.time} onChange={onChange}/>
            </div>

            <input className={styles.input} name="start_point" placeholder="출발지" value={form.start_point} onChange={onChange}/>
            <input className={styles.input} name="destination" placeholder="도착지" value={form.destination} onChange={onChange}/>

            <select className={styles.select} name="total_people" value={form.total_people} onChange={onChange}>
              <option value={1}>1명</option><option value={2}>2명</option>
              <option value={3}>3명</option><option value={4}>4명</option>
            </select>
            <div className={styles.hint}>* 전체 인원은 최대 4명까지 가능합니다.</div>

            <input className={styles.input} name="host_phone" placeholder="연락처 (예: 010-1234-5678)" value={form.host_phone} onChange={onChange}/>
            <textarea className={styles.textarea} name="note" placeholder="비고" value={form.note} onChange={onChange}/>

            <input className={styles.input} type="password" placeholder="수정 비밀번호 (필수, 4~12자)" value={pw} onChange={e=>setPw(e.target.value)}/>
            <input className={styles.input} type="password" placeholder="비밀번호 확인" value={pw2} onChange={e=>setPw2(e.target.value)}/>

            <div className={styles.actions}>
              <button className={`${styles.button} ${styles.btnGradient}`} type="submit">생성 하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
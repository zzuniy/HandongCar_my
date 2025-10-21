// src/pages/create.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";
import styles from "../assets/styles/create&update.module.css";

export default function CreatePage(){
  const navigate = useNavigate();
  const [submitting,setSubmitting] = useState(false);
  const [form,setForm] = useState({
    date:"", time:"", start_point:"", destination:"",
    total_people:1, current_people:0,
    host_phone:"", total_time:"", status:"모집 중",
    note:"", password:""
  });
  const [errors,setErrors] = useState({start_point:"",destination:"",note:"",password:""});

  const numericKeys = useMemo(()=>["total_people","current_people"],[]);

  const toInt = (v,fb=0)=>Number.isFinite(+v)?+v:fb;

  const validate = (f)=>{
    const e={start_point:"",destination:"",note:"",password:""};
    const under100 = (s)=> (s?.length??0) < 100;  // 100자 '미만'
    if(!under100(f.start_point)) e.start_point="출발지는 100자 미만이어야 합니다.";
    if(!under100(f.destination)) e.destination="도착지는 100자 미만이어야 합니다.";
    if(!under100(f.note)) e.note="비고는 100자 미만이어야 합니다.";
    if(!f.password) e.password="비밀번호는 필수입니다.";
    setErrors(e);
    return !e.start_point && !e.destination && !e.note && !e.password;
  };

  const onChange=(e)=>{
    const {name,value}=e.target;
    setForm((prev)=>{
      const draft={...prev,[name]: numericKeys.includes(name)? (value===""?"":toInt(value,0)) : value};
      if(["start_point","destination","note","password"].includes(name)) validate(draft);
      return draft;
    });
  };

  const onSubmit=async(e)=>{
    e.preventDefault();
    if(!validate(form)) { alert("입력값을 확인하세요."); return; }

    const total = toInt(form.total_people,1);
    const curr  = toInt(form.current_people,0);
    if(curr>total){ alert("현재 인원이 정원을 초과했습니다."); return; }

    const next={
      ...form,
      total_people: total,
      current_people: curr,
      status: curr>=total? "마감": (form.status || "모집 중"),
    };

    try{
      setSubmitting(true);
      const {data} = await createPost(next);
      alert("등록 완료!");
      navigate(`/detail/${data?.id ?? ""}`, { replace:true });
    }catch(err){
      console.error("[POST ERROR]",err?.response?.status,err?.message,err?.response?.data);
      alert("등록에 실패했습니다.");
    }finally{
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className={styles.card}>
        <h1>같이카 등록</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* 날짜/시간 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="date" className={styles.label}>날짜</label>
              <input id="date" className={styles.input} type="date" name="date" value={form.date} onChange={onChange} disabled={submitting}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="time" className={styles.label}>시간</label>
              <input id="time" className={styles.input} type="time" name="time" value={form.time} onChange={onChange} disabled={submitting}/>
            </div>
          </div>

          {/* 출발지 */}
          <div className={styles.field}>
            <label htmlFor="start_point" className={styles.label}>출발지 (100자 미만)</label>
            <input id="start_point" className={styles.input} name="start_point" value={form.start_point} onChange={onChange} maxLength={100} disabled={submitting}/>
            <span className={styles.counter}>{form.start_point.length}/100</span>
            {errors.start_point && <p className={styles.error}>{errors.start_point}</p>}
          </div>

          {/* 도착지 */}
          <div className={styles.field}>
            <label htmlFor="destination" className={styles.label}>도착지 (100자 미만)</label>
            <input id="destination" className={styles.input} name="destination" value={form.destination} onChange={onChange} maxLength={100} disabled={submitting}/>
            <span className={styles.counter}>{form.destination.length}/100</span>
            {errors.destination && <p className={styles.error}>{errors.destination}</p>}
          </div>

          {/* 정원/현재 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="total_people" className={styles.label}>정원</label>
              <select id="total_people" className={styles.select} name="total_people" value={form.total_people} onChange={onChange} disabled={submitting}>
                <option value={1}>1명</option><option value={2}>2명</option>
                <option value={3}>3명</option><option value={4}>4명</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="current_people" className={styles.label}>현재 인원</label>
              <input id="current_people" className={styles.input} type="number" min="0" name="current_people" value={form.current_people} onChange={onChange} disabled={submitting}/>
            </div>
          </div>

          {/* 연락처/소요시간 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="host_phone" className={styles.label}>호스트 연락처</label>
              <input id="host_phone" className={styles.input} name="host_phone" value={form.host_phone} onChange={onChange} disabled={submitting}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="total_time" className={styles.label}>소요시간</label>
              <input id="total_time" className={styles.input} name="total_time" value={form.total_time} onChange={onChange} disabled={submitting}/>
            </div>
          </div>

          {/* 상태 */}
          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>상태</label>
            <select id="status" className={styles.select} name="status" value={form.status} onChange={onChange} disabled={submitting}>
              <option value="모집 중">모집 중</option>
              <option value="마감">마감</option>
            </select>
          </div>

          {/* 비고 */}
          <div className={styles.field}>
            <label htmlFor="note" className={styles.label}>비고 (100자 미만)</label>
            <textarea id="note" className={styles.textarea} name="note" rows={4} value={form.note} onChange={onChange} maxLength={100} disabled={submitting}/>
            <span className={styles.counter}>{form.note.length}/100</span>
            {errors.note && <p className={styles.error}>{errors.note}</p>}
          </div>

          {/* 비밀번호 */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>비밀번호 (필수)</label>
            <input id="password" className={styles.input} type="password" name="password" value={form.password} onChange={onChange} disabled={submitting}/>
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.btnGradient}`} type="submit" disabled={submitting}>
              {submitting ? "등록 중…" : "등록 하기"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function PageShell({children}){
  return <div className={styles.page}><div className={styles.container}>{children}</div></div>;
}
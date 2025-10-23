// src/pages/update.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api";
import styles from "../assets/styles/create&update.module.css";

export default function UpdatePage(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [form,setForm] = useState(null);
  const [loading,setLoading] = useState(true);
  const [loadError,setLoadError] = useState("");
  const [pwOK,setPwOK] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const [errors,setErrors] = useState({start_point:"",destination:"",note:"",host_nickname:""});

  const numericKeys = useMemo(()=>["total_people","current_people"],[]);
  const toInt = (v,fb=0)=>Number.isFinite(+v)?+v:fb;
  const under100 = (s)=> (s?.length??0) < 100;
  const nickUnder10 = (s)=> (s?.length??0) < 10;

  // StrictMode 중복 prompt 방지
  const askedRef = useRef(false);

  const validate=(draft)=>{
    const e={start_point:"",destination:"",note:"",host_nickname:""};
    if(!under100(draft.start_point)) e.start_point="출발지는 100자 미만이어야 합니다.";
    if(!under100(draft.destination)) e.destination="도착지는 100자 미만이어야 합니다.";
    if(!under100(draft.note)) e.note="비고는 100자 미만이어야 합니다.";
    if(draft.host_nickname && !nickUnder10(draft.host_nickname)) e.host_nickname="호스트 닉네임은 10자 미만이어야 합니다.";
    setErrors(e);
    return Object.values(e).every(v=>!v);
  };

  const askPassword = (pw)=>{
    const input = window.prompt("이 게시글의 비밀번호를 입력하세요.");
    if(input===null) return false;
    if(String(input)===String(pw)) return true;
    alert("비밀번호가 올바르지 않습니다. 다시 시도하세요.");
    return askPassword(pw);
  };

  const fetchPost = async(force=false)=>{
    if(!id) return;
    if(!force && askedRef.current) return;
    askedRef.current = true;

    setLoading(true); setLoadError(""); setPwOK(false);

    try{
      const {data} = await getPost(id);
      if(!("password" in data)) throw new Error("PASSWORD_MISSING");

      const ok = askPassword(String(data.password));
      if(!ok){
        setLoadError("비밀번호 확인이 필요합니다. 아래 버튼으로 다시 시도하세요.");
        setForm(null);
        setPwOK(false);
        return;
      }

      const safe={
        id:data.id ?? id,
        // 1) 닉네임/전화번호
        host_nickname: data.host_nickname ?? "",
        host_phone: data.host_phone ?? "",
        // 2) 날짜/시간
        date:data.date ?? "", time:data.time ?? "",
        // 3) 출발/도착
        start_point:data.start_point ?? "", destination:data.destination ?? "",
        // 4) 정원/소요시간
        total_people:toInt(data.total_people,2),
        total_time:data.total_time ?? "",
        // 서버 보존용(편집 UI엔 없음)
        current_people:toInt(data.current_people,0),
        status:data.status ?? "모집 중",
        // 기타
        note:data.note ?? ""
      };
      setForm(safe); setPwOK(true); validate(safe);
    }catch(err){
      const st = err?.response?.status;
      setLoadError( err?.message==="PASSWORD_MISSING" ? "비밀번호 필드가 없는 게시글입니다. 데이터 규칙을 확인하세요."
                  : st===404 ? "해당 ID의 게시글이 없습니다. (404)" : "게시글을 불러올 수 없습니다." );
      console.error("[GET ERROR]",st,err?.message,err?.response?.data);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ askedRef.current=false; fetchPost(); /* eslint-disable-next-line */ },[id]);

  const onChange=(e)=>{
    const {name,value}=e.target;
    setForm((f)=>{
      const draft={...f,[name]: numericKeys.includes(name)? (value===""?"":toInt(value,0)) : value};
      if(["start_point","destination","note","host_nickname"].includes(name)) validate(draft);
      return draft;
    });
  };

  const onSubmit=async(e)=>{
    e.preventDefault();
    if(!pwOK) { alert("먼저 비밀번호를 확인하세요."); return; }
    if(!form) return;
    if(!validate(form)){ alert("입력값을 확인하세요."); return; }

    const total=toInt(form.total_people,2);
    const curr =toInt(form.current_people,0);
    if(curr>total){ alert("현재 인원보다 작은 정원으로는 저장할 수 없습니다."); return; }

    // 상태/현재인원은 상세에서 자동 노출 → 값은 보존만
    const next={ ...form, total_people:total, current_people:curr, status:form.status };

    try{
      setSubmitting(true);
      await updatePost(form.id ?? id, next);
      alert("수정 완료!");
      navigate(`/detail/${form.id ?? id}`,{replace:true});
    }catch(err){
      console.error("[PUT ERROR]",err?.response?.status,err?.message,err?.response?.data);
      alert("수정에 실패했습니다.");
    }finally{
      setSubmitting(false);
    }
  };

  if(loading){
    return <PageShell><div className={styles.card}>로딩 중…</div></PageShell>;
  }
  if(loadError){
    return (
      <PageShell>
        <div className={styles.card} style={{gap:12}}>
          <p style={{margin:0}}>{loadError}</p>
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.btnGradient}`} onClick={()=>fetchPost(true)}>비밀번호 다시 시도</button>
            <button className={styles.button} onClick={()=>navigate(-1)}>뒤로가기</button>
          </div>
        </div>
      </PageShell>
    );
  }
  if(!form || !pwOK){
    return <PageShell><div className={styles.card}>비밀번호 확인이 필요합니다.</div></PageShell>;
  }

  return (
    <PageShell>
      <div className={styles.card}>
        <h1>같이카 수정</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* 1) 닉네임 / 전화번호 */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label htmlFor="host_nickname" className={styles.label}>호스트 닉네임 (10자 미만)</label>
              <input
                id="host_nickname"
                className={styles.input}
                name="host_nickname"
                value={form.host_nickname}
                onChange={onChange}
                maxLength={10}
                disabled={submitting}
              />
              <span className={styles.counter}>{form.host_nickname.length}/10</span>
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
              <input id="date" className={styles.input} type="date" name="date" value={form.date} onChange={onChange} disabled={submitting}/>
            </div>
            <div className={styles.field}>
              <label htmlFor="time" className={styles.label}>시간</label>
              <input id="time" className={styles.input} type="time" name="time" value={form.time} onChange={onChange} disabled={submitting}/>
            </div>
          </div>

          {/* 3) 출발지 / 도착지 */}
          <div className={styles.field}>
            <label htmlFor="start_point" className={styles.label}>출발지 (100자 미만)</label>
            <input id="start_point" className={styles.input} name="start_point" value={form.start_point} onChange={onChange} maxLength={100} disabled={submitting}/>
            <span className={styles.counter}>{form.start_point.length}/100</span>
            {errors.start_point && <p className={styles.error}>{errors.start_point}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="destination" className={styles.label}>도착지 (100자 미만)</label>
            <input id="destination" className={styles.input} name="destination" value={form.destination} onChange={onChange} maxLength={100} disabled={submitting}/>
            <span className={styles.counter}>{form.destination.length}/100</span>
            {errors.destination && <p className={styles.error}>{errors.destination}</p>}
          </div>

          {/* 4) 정원 */}
          <div className={styles.field}>
            <label htmlFor="total_people" className={styles.label}>정원</label>
            <select id="total_people" className={styles.select} name="total_people" value={form.total_people} onChange={onChange} disabled={submitting}>
              <option value={2}>2명</option>
              <option value={3}>3명</option>
              <option value={4}>4명</option>
            </select>
          </div>

          {/* 비고 */}
          <div className={styles.field}>
            <label htmlFor="note" className={styles.label}>비고 (100자 미만)</label>
            <textarea id="note" className={styles.textarea} name="note" rows={4} value={form.note} onChange={onChange} maxLength={100} disabled={submitting}/>
            <span className={styles.counter}>{form.note.length}/100</span>
            {errors.note && <p className={styles.error}>{errors.note}</p>}
          </div>

          {/* 비밀번호 입력창 없음 (prompt로만 확인) */}
          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.btnGradient}`} type="submit" disabled={submitting}>
              {submitting ? "수정 중…" : "수정 하기"}
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
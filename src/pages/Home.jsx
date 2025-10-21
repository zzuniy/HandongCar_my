import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";

import './Home.css';
import { FaEdit, FaTrash,FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt  } from "react-icons/fa";

import "./Home.css";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt } from "react-icons/fa";

import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://68f63d016b852b1d6f169327.mockapi.io/posts")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("API 불러오기 오류:", err));
  }, []);

  return (
    <>
      <div className="recruit-text">
        <h1>카풀 모집</h1>
        <p className="with-text">함께 이용할 동승자를 찾아보세요</p>
      </div>

      <div className="addallign">
        <input type="text" className="search" placeholder="검색" />
        {/* 생성 페이지로 이동 (a처럼 보이는 Link) */}
        <Link to="/create" className="addcar as-button">
          + 게시글 추가
        </Link>
      </div>

      <br />

      {/* Card는 그대로, data만 전달 */}
      <Card data={data} />
    </>
  );
}

function Card({ data }) {
  if (!Array.isArray(data)) return null;

  // 삭제 핸들러: 팀 코드 영향 최소화 위해 새로고침 사용
  const handleDelete = async (id) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    try {
      await fetch(`https://68f63d016b852b1d6f169327.mockapi.io/posts/${id}`, {
        method: "DELETE",
      });
      // 상태 끌어올림 없이도 반영되게 전체 리로드 (충돌 최소화)
      window.location.reload();
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="cardallign">
      {data.map((item) => (
        // key는 index 대신 고유 id 사용 (리렌더 충돌 방지)
        <div key={item.id} className="card">
          <div className="card-header">
            <span className={`status ${item.status === "모집 중" ? "open" : "closed"}`}>
              {item.status}
            </span>

            <div className="card-actions">
              {/* 수정: /update/:id 로 이동 */}
              <Link
                to={`/update/${item.id}`}
                className="icon-btn"
                aria-label="수정하기"
                title="수정하기"
              >
                <FaEdit />
              </Link>

              {/* 삭제: confirm → DELETE → reload */}
              <button
                type="button"
                className="icon-btn"
                aria-label="삭제하기"
                title="삭제하기"
                onClick={() => handleDelete(item.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="card-info">
            <p>
              <FaMapMarkerAlt /> {item.start_point} → {item.destination}
            </p>
            <p>
              <FaRegClock /> {item.date} {item.time}
            </p>
            <p>
              <FaUserFriends /> {item.current_people}/{item.total_people}
            </p>
            <p>
              <FaPhoneAlt /> {item.host_phone}
            </p>
          </div>

          {/* 상세보기: /detail/:id 로 이동 */}
          <Link to={`/detail/${item.id}`} className="detail" role="button">
            상세보기
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
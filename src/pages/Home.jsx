import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";

import './Home.css';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // ✅ 추가

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
        <input type="text" className="search" placeholder="검색"></input>
        {/* ✅ create 페이지로 이동 */}
        <Link to="/create" className="addcar as-button">+ 게시글 추가</Link>
      </div>

      <br />

      <Card data={data} />
    </>
  );
};

function Card({ data }) {
  if (!Array.isArray(data)) return null;

  return (
    <div className="cardallign">
      {data.map((item, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <span
              className={`status ${item.status === "모집 중" ? "open" : "closed"
                }`}
            >
              {item.status}
            </span>
            <div className="card-actions">
              <button><FaEdit /></button>
              <button><FaTrash /></button>
            </div>
          </div>

          <div className="card-info">
            <p><FaMapMarkerAlt /> {item.start_point} → {item.destination}</p>
            <p><FaRegClock /> {item.date} {item.time}</p>
            <p><FaUserFriends /> {item.current_people}/{item.total_people}</p>
            <p><FaPhoneAlt /> {item.host_phone}</p>
          </div>

          {/* ✅ 상세보기 버튼 → /detail/:id 이동 */}
          <Link to={`/detail/${item.id}`} className="detail">상세보기</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
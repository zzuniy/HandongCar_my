import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";

import './Home.css';
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

  return(
    <><div className="layout">
    <p className="survice-p">한동대학교 전용 서비스</p>
   <h1 className = "forHGU-h1">한동대학교 학생들을 위한 </h1>
   <h1 className ="smart-h1">스마트 카풀 매칭</h1>
   <p className="explain-p">기존 오픈채팅방의 불편함을 해소하고, 직관적인 인터페이스로 원하는 시간대·노선의 카풀을 쉽고 빠르게 찾아보세요.</p>
   <button className="apply-btn">바로 체험하기</button>
   </div>
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


          <Link to={`/detail/${item.id}`} className="detail">상세보기</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
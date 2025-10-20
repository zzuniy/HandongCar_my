import React, {useEffect , useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";
import './Home.css';
import { FaEdit, FaTrash,FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt  } from "react-icons/fa";

const data = [
  {
    출발: "포항역",
    도착: "한동대",
    member:1,
    status: "모집중",
    date: "2025-10-17",
    phone: "010-1234-5678"
  },
  {
    출발: "한동대",
    도착: "경주역",
    member:4,
    status: "모집종료",
    date: "2025-10-18",
    phone: "010-9876-5432"
  },
  {
    출발: "대구공항",
    도착: "한동대",
    member:3,
    status: "모집중",
    date: "2025-10-19",
    phone: "010-1111-2222"
  },
  {
    출발: "용인역",
    도착: "한동대",
    member:2,
    status: "모집중",
    date: "2025-10-30",
    phone: "010-2345-2222"
  }
];

function Home(){
  return(
    <>
      <h2>카풀 모집</h2>
      <p>함께 이용할 동승자를 찾아보세요</p>
      <button>게시글 추가</button>
      <br/>
     <input type="text"></input>
     <Card />
    </>
  );
};
function Card(){
  return(
    <div className="cardallign">
      {data.map((item, index) => (
        <div key={index} className="card">
        <div className="card-header">
          <span className={`status ${item.status === "모집중" ? "open" : "closed"}`}>
            {item.status}
          </span>
          <div className="card-actions">
            <button><FaEdit /></button>
            <button><FaTrash /></button>
          </div>
        </div>
          <div className="card-info">
              <p><FaMapMarkerAlt /> {item.출발} → {item.도착}</p>
              <p><FaRegClock /> {item.date}</p>
              <p><FaUserFriends /> {item.member}/4</p>
              <p><FaPhoneAlt /> {item.phone}</p>
          </div>
          <button className="detail">상세보기</button>
        </div>
      ))}
    </div>
  );
};

export default Home;
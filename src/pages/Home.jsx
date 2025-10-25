import React, {useEffect , useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";
import carpoolImg from "./carpool.png";
import './Home.css';
import { FaUser, FaEdit, FaTrash, FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt, FaUniversity } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CarpoolSlideshow from "./CarpoolSlideshow";


function Home(){
  const [data, setData] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
    fetch("https://68f63d016b852b1d6f169327.mockapi.io/posts")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("API 불러오기 오류:", err));
  }, []);
  return(
    <><div className="layout">
      <div className="left">
    <p className="survice-p">
        <FaUniversity className="icon"  /> 
        한동대학교 전용 서비스
    </p>
   <h1 className = "forHGU-p">한동대학교 학생들을 위한 <br/>
      <span className="smart-h1">스마트 카풀 매칭</span>
    </h1>

   <p className="explain-p">기존 오픈채팅방의 불편함을 해소하고, 직관적인 인터페이스로 원하는 시간대·노선의 카풀을 쉽고 빠르게 찾아보세요.</p>
      
      <button 
      className="apply-btn" 
      onClick={() => navigate("/list")}
    >
      바로 체험하기
    </button>

   </div>
   <div className="right-image">
        
          <CarpoolSlideshow /> 
   </div>
   </div>
    </>
  );
};


export default Home;
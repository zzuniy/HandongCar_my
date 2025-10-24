import React, {useEffect , useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";

import './Home.css';
import { FaUser,FaEdit, FaTrash,FaMapMarkerAlt, FaRegClock, FaUserFriends, FaPhoneAlt  } from "react-icons/fa";



function Home(){
  const [data, setData] = useState([]);

    useEffect(() => {
    fetch("https://68f63d016b852b1d6f169327.mockapi.io/posts")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("API 불러오기 오류:", err));
  }, []);
  return(
    <>
   <h1>한동대학교 학생들을 위한 </h1>
   <h1>스마트 카풀 매칭</h1>
    </>
  );
};


export default Home;
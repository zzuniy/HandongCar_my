import React, {useEffect , useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";


function Home(){
  return(
    <>
      <h2>카풀 모집</h2>
      <p>함께 이용할 동승자를 찾아보세요</p>
      <button>게시글 추가</button>
      <br/>
     <input type="text"></input>
    </>
  );
};

export default Home;
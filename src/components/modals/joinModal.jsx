import React, {useEffect , useState } from "react";
import styled from "styled-components";

const detailModal = styled.div`
  display: block;
  justify-content: center;
  color: white;
  border-radius: 15px;
  z-index: 10;
`;

const backgroundDim = styled.div`
  width: 100%;
  height: 100%;
  background-color: #828282;
`;


export default function Join(){
  return(
    <>
      <backgroundDim>
        <detailModal>
          <h1>안녕</h1>
        </detailModal>
      </backgroundDim>
    </>
  );
};

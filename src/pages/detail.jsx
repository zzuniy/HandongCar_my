import React, {useEffect , useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";

const LeftPage = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const RightPage = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
`;
const Container = styled.div`
  border-radius: 15px;
  border: 1px solid black;
`;

function DetailPage(){
  return(
    <>
      <LeftPage>
        <Container>
          안낭앙아
        </Container>
      </LeftPage>
      <RightPage>

      </RightPage>
    </>
  );
};

export default DetailPage;
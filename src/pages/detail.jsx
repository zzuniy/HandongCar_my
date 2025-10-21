import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";

const PageWrap = styled.div`
  display: flex;
  gap: 10%;
  padding: 4%;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
`;

const LeftPage = styled.div`
  align-items: center;
  width: 100%;
`;
const RightPage = styled.div`
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
`;

const Container = styled.section`
  background: #fff;
  border: 1px solid #e8e8ec;
  border-radius: 14px;
  padding: 10%;
  box-shadow: 0 2px 10px rgba(18, 18, 23, 0.04);
`;

const CurrentSituation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 10%;
  font-size: 1.2%;         
  border-radius: 10px;
  padding: 1% 2%;
  margin: 0.5%;
  background-color: #E1FBE8;
`;

// ================ 정보 =================

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 16px;                              
  margin-top: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;         
  border-radius: 12px;  
`;

const InfoIcon = styled.div`
display: flex;
  justify-content: center;
  align-items: center;
  width: 5vw;
  height: 10vh;
  border-radius: 10px;
  background-color: #E1FBE8;
  flex-shrink: 0;
`;
const InfoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled.div`
  color: gray;
  font-size: 14px;
`;
const InfoContents = styled.p`
  color: black;
  font-weight: bold;
  margin: 2px 0 0 0;
`;

const SubTitle = styled.h2`
  display: flex;
`;


// ========== 사용자 정보 컨테이너 ==========

const UserIcon = styled.img`
  display: flex;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  background-color: #e6f0ff;
  object-fit: cover;

`;

const UserSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2%;
  margin-bottom: 2%;
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
`;

const UserSubInfo = styled.span`
  font-size: 12px;
  color: #6e6e73;
`;

const Contact = styled.a`
  font-weight: 700;
  font-size: 15px;
  color: #111;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function UserSection() {
  return (
    <UserSectionWrapper>
      <UserLeft>
        <UserIcon src="https://via.placeholder.com/40" alt="프로필" />
        <InfoContents>
          <UserName>김민수</UserName>
        </InfoContents>
      </UserLeft>

      <Contact href="tel:01012345678">010-1234-5678</Contact>
    </UserSectionWrapper>
  );
}

function DetailPage() {
  return (
    <>
      <PageWrap>
        <LeftPage>
          <Container>
            <CurrentSituation>모집중</CurrentSituation>

            <InfoGrid>
              <InfoItem>
                <InfoIcon>아이콘</InfoIcon>
                <InfoText>
                  <InfoTitle>출발지</InfoTitle>
                  <InfoContents>서울역</InfoContents>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <InfoIcon>아이콘A</InfoIcon>
                <InfoText>
                  <InfoTitle>도착지</InfoTitle>
                  <InfoContents>부산역</InfoContents>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <InfoIcon>아이콘B</InfoIcon>
                <InfoText>
                  <InfoTitle>출발일시</InfoTitle>
                  <InfoContents>2024년 1월 15일 오전 9:00</InfoContents>
                </InfoText>
              </InfoItem>

              <InfoItem>
                <InfoIcon>아이콘C</InfoIcon>
                <InfoText>
                  <InfoTitle>모집 인원</InfoTitle>
                  <InfoContents>3명(잔여 1명)</InfoContents>
                </InfoText>
              </InfoItem>
            </InfoGrid>
          </Container>

          <Container>
            <SubTitle>호스트 정보</SubTitle>
            <UserSection></UserSection>
          </Container>


        </LeftPage>
        <RightPage>

        </RightPage>
      </PageWrap>
    </>
  );
};

export default DetailPage;
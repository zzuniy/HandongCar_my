import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";
import Join from "../components/modals/joinModal";

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

// ================ 연속적으로 쓰일 상자 =================

const Container = styled.section`
  background: #fff;
  border: 1px solid #e8e8ec;
  border-radius: 14px;
  padding: 10%;
  box-shadow: 0 2px 10px rgba(18, 18, 23, 0.04);
`;

// ================ 모집 현황 =================

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


function Infomation() {
  return (
    <InfoItem>
      <InfoIcon>아이콘</InfoIcon>
      <InfoText>
        <InfoTitle>출발지</InfoTitle>
        <InfoContents>서울역</InfoContents>
      </InfoText>
    </InfoItem>
  )
}

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

const Contact = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #111;
  text-decoration: none;
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
      <Contact>010-1234-5678</Contact>
    </UserSectionWrapper>
  );
}

// ========== 신청 상자 ==========
const PriceCard = styled(Container)`            
  position: sticky;
  top: 24px;
  max-width: 360px;
  width: 100%;
`;

const SeatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 8px;
  font-size: 14px;
`;

const ProgressTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: #e8eaf0;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${(p) => p.percent}%;
  background: #2a62ff;
  transition: width 0.3s ease;
`;

const ApplyBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  background: #2a62ff;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

function ApplyContainer() {
  const percent = ( 2 / 4 )*100;

  return (
    
    <>
      <PriceCard>
        <SubTitle>15000원</SubTitle>
        <InfoTitle>1인당 요금</InfoTitle>

        <SeatsRow>
          <span>잔여좌석</span>
          <span>2석</span>
        </SeatsRow>
        <ProgressTrack>
          <ProgressBar percent={percent}/>
        </ProgressTrack>

        <ApplyBtn>신청하기</ApplyBtn>
      </PriceCard>
    </>
  )
}

function DetailPage() {
  return (
    <>
      <PageWrap>
        <LeftPage>
          <Container>
            <CurrentSituation>모집중</CurrentSituation>
            <SubTitle>모집 정보</SubTitle>
            <InfoGrid>
              <Infomation />
              <Infomation />
              <Infomation />
              <Infomation />
            </InfoGrid>

            <SubTitle>호스트 정보</SubTitle>
            <UserSection />
          </Container>

          <Container>
            <SubTitle>참여자 목록</SubTitle>
            <UserSection />
            <UserSection />
            <UserSection />
          </Container>

        </LeftPage>
        <RightPage>
          <ApplyContainer/>
        </RightPage>
      </PageWrap>
    </>
  );
};

export default DetailPage;
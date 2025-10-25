import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../assets/styles/StyledComponents";
import Join from "../components/modals/joinModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faFlagCheckered, faCalendar, faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";


const PageWrap = styled.div`
  display: flex;
  gap: 32px;               
  padding: 24px;           
  box-sizing: border-box;
  width: 100%;
  max-width: 1100px;       
  margin: 0 auto; 
`;

const LeftPage = styled.div`
  width: 100%;
  flex: 1;
  min-width: 0;
`;
const RightPage = styled.div`
  width: 360px;
  flex: 0 0 360px;
`;

// ================ 연속적으로 쓰일 상자 =================

const Container = styled.section`
  background: #fff;
  border: 1px solid #e8e8ec;
  border-radius: 14px;
  padding: 5% 10% 8% 10%;
  box-shadow: 0 2px 10px rgba(18, 18, 23, 0.04);
  margin-bottom: 3vh;
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
  width: 3vw;
  height: 6vh;
  border-radius: 10px;
  flex-shrink: 0;

  svg{
    font-size: 25px;
  }
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
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

const UserSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5%;
  margin-bottom: 1%;
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
const NoteText = styled.p`
  font-size: 13px;
  color: #555;
  margin-top: 5%;           
  margin-bottom: 0;
  line-height: 1.4;
  word-break: keep-all;      
  white-space: normal;       
  max-width: 280px;          
  overflow-wrap: break-word; 
`;

const Contact = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #111;
  text-decoration: none;
`;


function UserSection({ participant }) {
  const randomNumber = Math.floor(Math.random() * 99);
  const randomGender = Math.random() > 0.5 ? "men" : "women";
  const randomImage = `https://randomuser.me/api/portraits/${randomGender}/${randomNumber}.jpg`;
  return (

    <UserSectionWrapper>
      <UserLeft>
        <UserIcon src={randomImage} alt="프로필" />
        <InfoContents>
          <UserName>{participant?.participant_nickname}</UserName>
          <NoteText>{participant?.participant_note}</NoteText>
        </InfoContents>
      </UserLeft>
      <Contact>{participant?.participant_phone}</Contact>
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

function ApplyContainer({ data, perPerson, routeSummary }) {
  const total = Number(data?.total_people ?? 0);
  const current = Number(data?.current_people ?? 0);
  const remain = Math.max(0, total - current);
  const percent = total > 0 ? (current / total) * 100 : 0;

  const priceText = perPerson != null ? `${perPerson.toLocaleString()}원` : `-`;
  const minutes = routeSummary?.duration ? Math.round(routeSummary.duration / 60) : null;

  return (
    <>
      <PriceCard>
        <SubTitle>{priceText}</SubTitle>
        <InfoTitle>1인당 요금</InfoTitle>

        <SeatsRow>
          <span>잔여좌석</span>
          <span>{remain}석</span>
        </SeatsRow>
        <ProgressTrack>
          <ProgressBar percent={percent} />
        </ProgressTrack>
        {minutes != null && (
          <InfoTitle style={{ marginTop: 12 }}>
            예상 소요시간: <b>{minutes}분</b>
          </InfoTitle>
        )}
        <ApplyBtn>신청하기</ApplyBtn>
      </PriceCard>
    </>
  )
}





function DetailPage() {

  const KAKAO_KEY = process.env.REACT_APP_KAKAO_REST_KEY;

  const [data, setData] = useState({});
  const [participants, setParticipants] = useState([]);
  const { id } = useParams();

  const [routeSummary, setRouteSummary] = useState(null);
  const [perPerson, setPerPerson] = useState(0);


  const randomNumber = Math.floor(Math.random() * 99);
  const randomGender = Math.random() > 0.5 ? "men" : "women";
  const randomImage = `https://randomuser.me/api/portraits/${randomGender}/${randomNumber}.jpg`;

  async function getPostInfo() {
    try {
      const res = await axios.get(`https://68f63d016b852b1d6f169327.mockapi.io/posts/${id}`);
      setData(res.data);
      console.log("게시글 api 연결 성공", res.data)
    } catch (err) {
      console.error(err);
    }
  }

  async function getParticipantsInfo() {
    try {
      const response = await axios.get(`https://68f63d016b852b1d6f169327.mockapi.io/participants`,
        { params: { post_id: id } }
      );
      setParticipants(response.data ?? []);
      console.log("참가자api 연결 성공", response.data)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPostInfo();
    getParticipantsInfo();
  }, [id]);

  const getKaKaoMobility = async (post) => {
    if (!KAKAO_KEY) {
      console.warn("Kakao REST Key가 없습니다. .env 설정을 확인하세요.");
      return;
    }
    try {
      const response = await axios.get(`https://apis-navi.kakaomobility.com/v1/directions`, {
        headers: {
          Authorization: `KakaoAK ${KAKAO_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          origin: `${post.start_lng},${post.start_lat}`,
          destination: `${post.dest_lng},${post.dest_lat}`,
        },
      });

      console.log(response.data);

      const route = response?.data?.routes?.[0];
      if (!route || route.result_code !== 0) return;

      const sum = route.summary;
      setRouteSummary(sum);

      const capacity = Number(post.total_people ?? 1);
      const split = Math.max(1, capacity);
      const per = sum?.fare?.taxi ? Math.round(sum.fare.taxi / split) : null;
      setPerPerson(per);

    } catch (error) {
      console.error("카카오 API 호출 오류:", error);
    }
  };

  useEffect(() => {
    if (data?.start_lat && data?.start_lng && data?.dest_lat && data?.dest_lng) {
      getKaKaoMobility(data);
    }
  }, [data]);

  return (
    <>
      <PageWrap>
        <LeftPage>
          <Container>
            <CurrentSituation>{data.status}</CurrentSituation>
            <SubTitle>모집 정보</SubTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIcon style={{ backgroundColor: "#E1FBE8" }}><FontAwesomeIcon icon={faLocationDot} style={{ color: "#469c4d" }} /></InfoIcon>
                <InfoText>
                  <InfoTitle>출발지</InfoTitle>
                  <InfoContents>{data.start_point}</InfoContents>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon style={{ background: "#FAE2E2" }}><FontAwesomeIcon icon={faFlagCheckered} style={{ color: "#cf4a44", }} /></InfoIcon>
                <InfoText>
                  <InfoTitle>도착지</InfoTitle>
                  <InfoContents>{data.destination}</InfoContents>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon style={{ background: "#DEE9FC" }}><FontAwesomeIcon icon={faCalendar} style={{ color: "#355fe2" }} /></InfoIcon>
                <InfoText>
                  <InfoTitle>출발 일시</InfoTitle>
                  <InfoContents>{data.date}</InfoContents>
                  <InfoContents>{data.time}</InfoContents>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon style={{ background: "#F1E8FD" }}><FontAwesomeIcon icon={faUsers} style={{ color: "#8435e0" }} /></InfoIcon>
                <InfoText>
                  <InfoTitle>모집인원</InfoTitle>
                  <InfoContents>{data.total_people}명 (잔여 {Math.max(0, (data.total_people ?? 0) - (data.current_people ?? 0))}명)</InfoContents>
                </InfoText>
              </InfoItem>
            </InfoGrid>
            <hr style={{ border: "1px solid #e5e7eb", margin: "24px 0" }} />
            <SubTitle>호스트 정보</SubTitle>
            <UserSectionWrapper>
              <UserLeft>
                <UserIcon src={randomImage} alt="프로필" />
                <InfoContents>
                  <UserName>{data.host_nickname}</UserName>
                  <NoteText>{data.note}</NoteText>
                </InfoContents>
              </UserLeft>
              <Contact>{data.host_phone}</Contact>
            </UserSectionWrapper>
          </Container>

          <Container>
            <SubTitle>참여자 목록</SubTitle>
            {participants.length === 0 ? (
              <InfoTitle>아직 참여자가 없습니다.</InfoTitle>
            ) : (
              participants.map((p) => (
                <UserSection key={p.id} participant={p} />
              ))
            )}
          </Container>

        </LeftPage>
        <RightPage>
          <ApplyContainer data={data} perPerson={perPerson} routeSummary={routeSummary} />
        </RightPage>
      </PageWrap>
    </>
  );
};

export default DetailPage;
// create.jsx 안에서 validate 함수 교체
const phoneRe = /^01[0-9]-\d{3,4}-\d{4}$/; // 010-1234-5678 형태(010/011 등 허용)

const validate = (f) => {
  const e = {
    host_nickname: "",
    host_phone: "",
    start_point: "",
    destination: "",
    start_lat: "",
    dest_lat: "",
    date: "",
    time: "",
    note: "",
    password: "",
  };

  const under100 = (s) => (s?.length ?? 0) < 100;
  const nickUnder10 = (s) => (s?.length ?? 0) < 10;

  // 닉네임: 비었을 때/길이 초과 구분
  if (!f.host_nickname) e.host_nickname = "닉네임을 입력하세요.";
  else if (!nickUnder10(f.host_nickname)) e.host_nickname = "닉네임은 10자 미만이어야 합니다.";

  // 전화번호
  if (!f.host_phone) e.host_phone = "전화번호를 입력하세요.";
  else if (!phoneRe.test(f.host_phone)) e.host_phone = "전화번호 형식(010-1234-5678)으로 입력하세요.";

  // 출발/도착 텍스트
  if (!f.start_point) e.start_point = "출발지를 선택해 주세요.";
  else if (!under100(f.start_point)) e.start_point = "출발지는 100자 미만이어야 합니다.";
  if (!f.destination) e.destination = "도착지를 선택해 주세요.";
  else if (!under100(f.destination)) e.destination = "도착지는 100자 미만이어야 합니다.";

  // 좌표(목록 선택 여부)
  if (f.start_point && (f.start_lat == null || f.start_lng == null))
    e.start_lat = "출발지 좌표가 없습니다. 목록에서 장소를 선택하세요.";
  if (f.destination && (f.dest_lat == null || f.dest_lng == null))
    e.dest_lat = "도착지 좌표가 없습니다. 목록에서 장소를 선택하세요.";

  // 날짜/시간
  if (!f.date) e.date = "날짜를 선택하세요.";
  if (!f.time) e.time = "시간을 선택하세요.";

  if (!under100(f.note)) e.note = "비고는 100자 미만이어야 합니다.";
  if (!f.password) e.password = "비밀번호는 필수입니다.";

  setErrors(e);
  return e; // 맵 그대로 반환
};
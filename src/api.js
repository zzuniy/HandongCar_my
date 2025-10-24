import axios from "axios";

// ✅ baseURL 지정
const baseURL =
  process.env.REACT_APP_API_BASE ||
  "https://68f63d016b852b1d6f169327.mockapi.io";

// ✅ axios 인스턴스 생성
export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ posts
export const createPost = (data) => api.post("/posts", data);
export const getPost = (id) => api.get(`/posts/${id}`);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);

// ✅ participants (참여자 기능은 팀 다른 파트에서)
export const getParticipantsByPost = (post_id) =>
  api.get("/participants", { params: { post_id } });
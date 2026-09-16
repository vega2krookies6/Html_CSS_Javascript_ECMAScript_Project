import { useEffect, useState } from 'react';
import { fetchStudents } from './api/studentApi';
import './style.css'

function App() {
  //상태 변수 선언
  const [students, setStudents] = useState([]);          // 표에 그릴 학생 목록
  //const [form, setForm] = useState(EMPTY_FORM);          // 입력칸 여섯 개의 값
  const [editingId, setEditingId] = useState(null);      // null 이면 등록 모드
  const [loading, setLoading] = useState(false);         // "로딩 중..." 을 보일까
  const [listError, setListError] = useState(null);      // 표 자리에 낼 오류 문구
  // 메시지는 { text: "문구", type: "error" 또는 "success" } 모양으로 담는다.
  const [message, setMessage] = useState(null);          //성공,오류 메시지

  // 수정 모드인지는 editingId 로 알 수 있으므로 따로 state 를 두지 않는다.
  const isEditing = editingId !== null;

  async function loadStudents() {
    setLoading(true);
    setListError(null);

    try {
      const data = await fetchStudents();
      console.log("Fetched students:", data);

      // 4부에서는 renderStudentTable(data) 를 불렀다.
      // 여기서는 값만 바꾸면 React 가 표를 다시 그린다.
      setStudents(data);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: error.message, type: "error" });
      setListError("오류: 데이터를 불러올 수 없습니다.");
    } finally {
      // 성공하든 실패하든 로딩 표시는 반드시 끈다.
      setLoading(false);
    }
  }

  useEffect(() => {
    // 아래 주석은 ESLint 에게 "이 경고는 알고 있다"고 알려 주는 줄이다.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 처음 한 번 목록을 불러오는 것은 의도된 동작입니다
    loadStudents();
  },[]);

  return (
    <>
      <h1>학생 관리 시스템</h1>
    </>
  )
}

export default App

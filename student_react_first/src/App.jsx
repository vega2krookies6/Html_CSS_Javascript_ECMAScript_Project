import { useState } from 'react';
import './style.css'

function App() {
  //상태 변수 선언
  const [students, setStudents] = useState([]);          // 표에 그릴 학생 목록
  //const [form, setForm] = useState(EMPTY_FORM);          // 입력칸 여섯 개의 값
  const [editingId, setEditingId] = useState(null);      // null 이면 등록 모드
  const [loading, setLoading] = useState(false);         // "로딩 중..." 을 보일까
  const [listError, setListError] = useState(null);      // 표 자리에 낼 오류 문구
  // 메시지는 { text: "문구", type: "error" 또는 "success" } 모양으로 담는다.
  const [message, setMessage] = useState(null);

  // 수정 모드인지는 editingId 로 알 수 있으므로 따로 state 를 두지 않는다.
  const isEditing = editingId !== null;


  return (
    <>
      <h1>학생 관리 시스템</h1>
    </>
  )
}

export default App

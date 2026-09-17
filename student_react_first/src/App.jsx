import { useEffect, useState } from 'react';

import { fetchStudents, createStudent, updateStudent } from './api/studentApi';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import { EMPTY_FORM, toRequest } from './lib/studentData';
import { validateStudent } from './lib/validation';

import './style.css'

const MESSAGE_TIMEOUT = 3000;

function App() {
  //상태 변수 선언
  const [students, setStudents] = useState([]);          // 표에 그릴 학생 목록
  const [form, setForm] = useState(EMPTY_FORM);          // 입력칸 여섯 개의 값
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
  }, []);

  /* -----------------------------------------------------
       성공 메시지는 3초 뒤에 저절로 사라진다
       4부에서 messageTimer 변수를 두고 clearTimeout 을 부르던 일을
       useEffect 가 대신한다. return 으로 돌려준 함수를 정리 함수라고
       하는데, 메시지가 바뀌기 직전에 React 가 이것을 먼저 불러 준다.
       그래서 이전 예약이 새 메시지를 지워 버리는 일이 없다.
    ----------------------------------------------------- */
  useEffect(() => {
    if (!message) {
      return;
    }

    // 오류 메시지는 사용자가 고칠 때까지 남겨 둔다.
    if (message.type !== "success") {
      return;
    }

    const timer = setTimeout(() => setMessage(null), MESSAGE_TIMEOUT);

    // 정리(clean up) 함수 — 다음 번 실행 직전과 화면에서 사라질 때 불린다.
    return () => clearTimeout(timer);
  }, [message]);


  function handleEdit() {

  }//handleEdit

  function handleDelete() {

  }//handleDelete

  function handleChange(event) {
    // 어느 칸이 바뀌었는지, 값은 무엇인지 꺼낸다.
    //   event.target       방금 글자를 친 input
    //   event.target.name  그 input 에 적어 둔 name
    const name = event.target.name;
    const value = event.target.value;

    // 기존 값을 그대로 복사한 새 객체를 만든다.
    const next = { ...form };
    console.log(next)

    // 바뀐 칸 하나만 덮어쓴다.
    // next.name 이 아니라 next[name] 인 이유는
    // 어느 칸인지가 name 변수에 담겨 있기 때문이다.
    next[name] = value;

    setForm(next);
  }//handleChange

  // 실습 5-8 에서 속을 채운다.
  async function handleSubmit(event) {
    // 이 한 줄은 지금 넣어야 한다. 없으면 제출할 때마다
    // 브라우저가 페이지를 새로 불러와 입력한 값이 날아간다.
    event.preventDefault();

    setMessage(null);            // 앞선 메시지를 지운다

    const studentData = toRequest(form);

    // 검사에 걸리면 메시지만 보여 주고 끝낸다.
    const errorMessage = validateStudent(studentData);
    if (errorMessage) {
      setMessage({ text: errorMessage, type: "error" });
      return;
    }

    try {
      if (isEditing) {
        await updateStudent(editingId, studentData);
        setMessage({ text: "학생 정보가 성공적으로 수정되었습니다.", type: "success" });
      } else {
        await createStudent(studentData);
        setMessage({ text: "학생이 성공적으로 등록되었습니다.", type: "success" });
      }

      resetForm();
      await loadStudents();         // 목록 새로고침
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: error.message, type: "error" });   // 서버가 보낸 실제 메시지
    }


  }//handleSubmit

  // 실습 5-9 에서 속을 채운다.
  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);

  }//resetForm



  return (
    <>
      <h1>학생 관리 시스템</h1>

      <StudentForm
        form={form}
        isEditing={isEditing}
        message={message}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <StudentTable
        students={students}
        loading={loading}
        error={listError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </>
  )
}

export default App

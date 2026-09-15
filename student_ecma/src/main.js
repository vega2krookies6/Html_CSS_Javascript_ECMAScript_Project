import './style.css'
import {
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent as apiUpdateStudent,
    deleteStudent as apiDeleteStudent,
} from './api/studentApi';

import {
    studentForm, collectStudentData, cancelButton,
    fillForm, setEditMode, resetForm, scrollToForm,
} from "./ui/studentForm.js";

import { validateStudent } from "./lib/validation.js";
import { showError, showSuccess, clearMessages, setLoading } from "./ui/message.js";
import { renderStudentTable, renderTableError, studentTableBody, } from "./ui/studentTable.js";


// 현재 수정 중인 학생 ID
let editingStudentId = null;


// 폼 제출 이벤트 핸들러
// 핸들러 안에서 await 을 쓰려면 함수에 async 를 붙여야 한다.
studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();          // 폼 제출로 페이지가 새로고침되는 것을 막는다
    clearMessages();
 
    const studentData = collectStudentData();
 
    // validateStudent 는 문제가 있으면 메시지를, 없으면 null 을 돌려준다.
    // 문제가 있으면 여기서 끝낸다(early return).
    const errorMessage = validateStudent(studentData);
    if (errorMessage) {
        showError(errorMessage);
        return;
    }
 
    try {
        // editingStudentId 에 값이 있으면 수정, 없으면 등록이다.
        if (editingStudentId) {
            await updateStudent(editingStudentId, studentData);
            showSuccess("학생 정보가 성공적으로 수정되었습니다.");
        } else {
            await createStudent(studentData);
            showSuccess("학생이 성공적으로 등록되었습니다.");
        }
 
        editingStudentId = null;
        resetForm();
        await loadStudents();         // 목록 새로고침
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);     // 서버가 보낸 실제 메시지
    }
});

// studentForm.addEventListener("submit", function (e) {
//     e.preventDefault();

//     //FormData에 저장된 값을 추출하여 서버로 전송할 중첩된 객체를 다시 생성하기
//     const studentData = collectStudentData();
//     console.log(studentData);

//     // 유효성 검사
//     // 바꾼 뒤 — 돌아온 메시지를 화면에 보여 준다
//     const errorMessage = validateStudent(studentData);
//     if (errorMessage) {
//         showError(errorMessage);
//         return;
//     }

//     // 수정 
//     if (editingStudentId) {
//         updateStudent(editingStudentId, studentData);
//     } else {
//         // 등록
//         createStudent(studentData);
//     }

// });

cancelButton.addEventListener("click", () => {
    editingStudentId = null;
    resetForm();
    clearMessages();
});


async function loadStudents() {
    setLoading(true);

    // try 안에서 오류가 나면 곧바로 catch 로 넘어간다.
    // finally 는 성공하든 실패하든 마지막에 반드시 실행된다.
    try {
        // await 은 서버 응답이 올 때까지 기다린다.
        // 3부의 fetch().then().then() 사슬이 두 줄이 되었다.
        const students = await fetchStudents();
        renderStudentTable(students);
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
        renderTableError();
    } finally {
        // 여기에 두면 성공 경로와 실패 경로에 두 번 적지 않아도 된다.
        setLoading(false);
    }
}

/* 버튼마다 이벤트를 걸지 않는 이유는, 표를 다시 그릴 때마다
   버튼이 새로 만들어져 매번 다시 걸어야 하기 때문이다.
   사라지지 않는 부모인 tbody 에 한 번만 걸어 두면
   나중에 생기는 행의 버튼도 그대로 동작한다(이벤트 위임). */
studentTableBody.addEventListener("click", async (event) => {
    // tbody 안에서 일어난 클릭이 전부 여기로 들어온다.
    // 이름 칸을 눌렀는지 버튼을 눌렀는지 먼저 가려내야 한다.
    //
    //   event.target  이벤트를 건 tbody 가 아니라 실제로 눌린 가장 안쪽 요소
    //   closest(...)  자기 자신부터 부모 쪽으로 올라가며 조건에 맞는 첫 요소를 찾는다
    //                 끝까지 없으면 null 을 돌려준다
    //<button type="button" class="edit-btn" data-action="edit" data-id="1">수정</button>
    const button = event.target.closest("button[data-action]");
    if (!button) return;             // 버튼이 아닌 곳을 눌렀다
 
    // data-action="edit" 은 button.dataset.action 으로 읽는다.
    const { action, id } = button.dataset;
 
    // dataset 값은 언제나 문자열이다. data-id="3" 이면 "3" 이 온다.
    // 그래서 Number() 로 숫자로 바꿔서 넘긴다.
    if (action === "edit") {
        await editStudent(Number(id));
    } else if (action === "delete") {
        await deleteStudent(Number(id));
    }
});


// 학생 수정 처리
async function updateStudent(studentId, studentData) {
    try {
        await apiUpdateStudent(studentId, studentData);

        resetForm();   // clearMessages() 가 들어 있으므로 메시지보다 먼저
        showSuccess("학생 정보가 성공적으로 수정되었습니다.");
        loadStudents();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

// 학생 삭제 — confirm 은 화면 처리이므로 그대로 남는다
async function deleteStudent(studentId) {
    if (!confirm("정말로 이 학생을 삭제하시겠습니까?")) {
        return;
    }

    try {
        await apiDeleteStudent(studentId);

        showSuccess("학생이 성공적으로 삭제되었습니다.");
        loadStudents();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

// 바꾼 뒤 — 폼 다루기는 studentForm.js 에 맡긴다
async function editStudent(studentId) {
    try {
        const student = await fetchStudent(studentId);
 
        fillForm(student);
        editingStudentId = studentId;
        setEditMode(true);
        scrollToForm();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

// Student load 함수 호출
loadStudents();

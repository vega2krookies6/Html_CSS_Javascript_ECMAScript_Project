import './style.css'
import {
    fetchStudents as fetchStuAll,
    fetchStudent as apiFetchStudent,
    createStudent as apiCreateStudent,
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

// DOM 요소 참조
const submitButton = studentForm.querySelector('button[type="submit"]');


// 초기화
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
});

// 폼 제출 이벤트 핸들러
studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    //FormData에 저장된 값을 추출하여 서버로 전송할 중첩된 객체를 다시 생성하기
    const studentData = collectStudentData();
    console.log(studentData);

    // 유효성 검사
    // 바꾼 뒤 — 돌아온 메시지를 화면에 보여 준다
    const errorMessage = validateStudent(studentData);
    if (errorMessage) {
        showError(errorMessage);
        return;
    }

    // 수정 
    if (editingStudentId) {
        updateStudent(editingStudentId, studentData);
    } else {
        // 등록
        createStudent(studentData);
    }

});

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
        //const students = await fetchStudents();
        const students = await fetchStuAll();
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

async function createStudent(studentData) {
    try {
        await apiCreateStudent(studentData);

        showSuccess("학생이 성공적으로 등록되었습니다.");
        studentForm.reset();
        loadStudents();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}

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
        const student = await apiFetchStudent(studentId);
 
        fillForm(student);
        editingStudentId = studentId;
        setEditMode(true);
        scrollToForm();
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}



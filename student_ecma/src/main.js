import './style.css'
import {
    fetchStudents as fetchStuAll,
    fetchStudent as apiFetchStudent,
    createStudent as apiCreateStudent,
    updateStudent as apiUpdateStudent,
    deleteStudent as apiDeleteStudent,
} from './api/studentApi';

import { studentForm, collectStudentData } from "./ui/studentForm.js";
import { validateStudent } from "./lib/validation.js";

// 현재 수정 중인 학생 ID
let editingStudentId = null;

// DOM 요소 참조
const studentTableBody = document.getElementById("studentTableBody");
const submitButton = studentForm.querySelector('button[type="submit"]');
const cancelButton = studentForm.querySelector('.cancel-btn');

//에러메시지와 로딩메시지 
const loadingMessage = document.getElementById('loadingMessage');
const formError = document.getElementById('formError');

// 성공 메시지가 저절로 사라지기까지의 시간(ms)
const MESSAGE_TIMEOUT = 3000;
// 자동 초기화 예약. 새 메시지가 오면 이전 예약을 취소한다.
let messageTimer = null;


// 에러 메시지 표시
function showError(message) {
    clearTimeout(messageTimer);          // 앞선 자동 초기화 예약을 취소한다
    formError.textContent = message;
    formError.style.display = 'block';
    formError.style.color = '#dc3545';
    messageTimer = setTimeout(clearMessages, MESSAGE_TIMEOUT);
}

// 성공 메시지 표시 - MESSAGE_TIMEOUT 뒤에 저절로 사라진다
function showSuccess(message) {
    clearTimeout(messageTimer);
    formError.textContent = message;
    formError.style.display = 'block';
    formError.style.color = '#28a745';
    messageTimer = setTimeout(clearMessages, MESSAGE_TIMEOUT);
}

// 메시지 초기화
function clearMessages() {
    clearTimeout(messageTimer);          // 예약이 남아 있으면 함께 취소한다
    messageTimer = null;
    formError.textContent = '';
    formError.style.display = 'none';
}
// Form 초기화
function resetForm() {
    studentForm.reset();
    editingStudentId = null;
    submitButton.textContent = '학생 등록';
    clearMessages();
}


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

cancelButton.addEventListener('click', function () {
    studentForm.reset();
});

async function loadStudents() {
    loadingMessage.style.display = "block";

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
    } finally {
        // 여기에 두면 성공 경로와 실패 경로에 두 번 적지 않아도 된다.
        loadingMessage.style.display = "none";
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
 
// 수정 전 데이터 로드 — 폼 채우기는 실습 4-9 에서 fillForm 으로 옮긴다
async function editStudent(studentId) {
    try {
        const student = await apiFetchStudent(studentId);
 
        studentForm.name.value = student.name;
        studentForm.studentNumber.value = student.studentNumber;
 
        if (student.detail) {
            studentForm.address.value = student.detail.address;
            studentForm.phoneNumber.value = student.detail.phoneNumber;
            studentForm.email.value = student.detail.email || "";
            studentForm.dateOfBirth.value = student.detail.dateOfBirth || "";
        }
 
        editingStudentId = studentId;
        submitButton.textContent = "학생 수정";
        studentForm.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error("Error:", error);
        showError(error.message);
    }
}


function renderStudentTable(students) {
    studentTableBody.innerHTML = "";

    students.forEach((student) => {
        const row = document.createElement("tr");

        //${student.detail ? student.detail.email || "-" : "-"}
        row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.studentNumber}</td>
                    <td>${student.detail?.address ?? "-"}</td>
                    <td>${student.detail?.phoneNumber ?? "-"}</td>
                    <td>${student.detail?.email ?? "-"}</td>
                    <td>${student.detail?.dateOfBirth ?? "-"}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${student.id})">수정</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id})">삭제</button>
                    </td>
                `;

        studentTableBody.appendChild(row);
    });
}


window.editStudent = editStudent;
window.deleteStudent = deleteStudent;

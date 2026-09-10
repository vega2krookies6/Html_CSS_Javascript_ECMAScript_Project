// 전역 변수
const API_BASE_URL = "http://localhost:8080";

// DOM 요소 참조
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

// 초기화
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
});

// 폼 제출 이벤트 핸들러
studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("폼 제출됨");
});

// 학생 목록 로드 함수
function loadStudents() {
    console.log("학생 목록 로드 중...");
}
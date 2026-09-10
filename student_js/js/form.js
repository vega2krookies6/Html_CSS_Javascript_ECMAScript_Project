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
    const formData = new FormData(studentForm);

    // console.log(Object.fromEntries(formData));

    // console.log("entries()")
    // for (const [key, value] of formData.entries()) {
    //     console.log(key, "=", value);
    // }

    const studentData = {
        name: formData.get("name").trim(),
        studentNumber: formData.get("studentNumber").trim(),
        detailRequest: {
            address: formData.get("address").trim(),
            phoneNumber: formData.get("phoneNumber").trim(),
            email: formData.get("email").trim() || null,
            dateOfBirth: formData.get("dateOfBirth") || null,
        },
    };

});

// 학생 목록 로드 함수
function loadStudents() {
    console.log("학생 목록 로드 중...");
}
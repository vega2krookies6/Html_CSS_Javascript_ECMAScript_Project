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
    // 유효성 검사
    if (!validateStudent(studentData)) {
        return;
    }
    console.log("유효한 데이터:", studentData);

    // 서버로 데이터 전송
    createStudent(studentData);

});

// 학생 등록 함수 
function createStudent(studentData) {
    console.log("학생 등록...");
}

// 학생 목록 로드 함수
function loadStudents() {
    console.log("학생 목록 로드 중...");
}

// 학생 데이터 유효성 검사
function validateStudent(student) {
    // 필수 필드 검사
    if (!student.name) {
        alert("이름을 입력해주세요.");
        return false;
    }

    if (!student.studentNumber || !isValidStudentNumber(student.studentNumber)) {
        alert("학번을 입력하지 않거나 올바른 형식이 아닙니다.");
        return false;
    }

    // 전화번호 형식 검사
    const phonePattern = /^[0-9-\s]+$/;
    if (!student.detailRequest.phoneNumber || !phonePattern.test(student.detailRequest.phoneNumber)) {
        alert("전화번호를 입력하지 않거나 올바른 전화번호 형식이 아닙니다.");
        return false;
    }

    // 이메일 형식 검사 (입력된 경우에만)
    if (!student.detailRequest.email || !isValidEmail(student.detailRequest.email)) {
        alert("이메일를 입력하지 않거나 올바른 이메일 형식이 아닙니다.");
        return false;
    }

    return true;
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
//학번 유효성 검사
function isValidStudentNumber(studentNumber) {
    const studentNumberRegex = /^[A-Z]{2}\d{3}$/i;
    // 공백이 포함되어 들어올 수 있으므로 trim()을 사용해 양끝 공백 제거 후 검사
    return studentNumberRegex.test(studentNumber.trim());
}
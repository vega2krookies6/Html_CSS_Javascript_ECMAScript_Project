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
    // document.getElementById("name")는 HTMLElement 객체
    //const name = document.getElementById("name").value;
    const formData = new FormData(studentForm);

    // console.log(Object.fromEntries(formData));
    // console.log("entries()")
    // for (const [key, value] of formData.entries()) {
    //     console.log(key, "=", value);
    // }

    //FormData에 저장된 값을 추출하여 서버로 전송할 중첩된 객체를 다시 생성하기
    const studentData = {
        name: formData.get("name").trim(),
        studentNumber: formData.get("studentNumber").trim(),
        detailRequest: {
            address: formData.get("address").trim() || null,
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

// async/await 사용한 학생 등록 함수 
async function createStudent(studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
        });

        const data = await response.json();

        if (!response.ok) {
            const defaultMsg = response.status === 409 ? "이미 등록된 학번(이메일,전화번호)입니다." : "학생 등록에 실패했습니다.";
            // resonponse.json() 로 받은 객체가 백엔드에서는 ErrorObject
            throw new Error(data.message || defaultMsg);
        }

        alert("학생이 성공적으로 등록되었습니다.");
        studentForm.reset();
        loadStudents();
        return data;
    } catch (error) {
        console.error("Error:", error.message);
        studentForm.reset();
        alert(error.message);
    }
}

// 학생 삭제 함수
async function deleteStudent(studentId) {
    if (!confirm('정말로 이 학생을 삭제하시겠습니까?')) return;
    
    try {
        const response = fetch(`${API_BASE_URL}/api/students/${studentId}`, {
            method: 'DELETE'
        });

        // 응답 본문을  읽어오기
        const data = await response.json();
        
        if (!response.ok) {
            const defaultMsg = response.status === 404 ? "존재하지 않는 학생입니다.":"학생 삭제에 실패했습니다.";
            throw new Error(data.message || defaultMsg)
        }

        alert('학생이 성공적으로 삭제되었습니다.')
        //showSuccess('학생이 성공적으로 삭제되었습니다.');
        loadStudents(); // 목록 새로고침
    } catch(error) {
        console.error('Error:', error);
        //showError(error.message);
        alert(error.message)
    }
}

// 학생 등록 함수 
function createStudent_then(studentData) {
    console.log("학생 등록...");
    fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
    })
        .then(async (response) => {
            if (!response.ok) {
                // 응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();

                // 상태 코드와 메시지를 확인하여 적절한 에러 처리
                if (response.status === 409) {
                    // 중복 오류 처리
                    throw new Error(errorData.message || "이미 등록된 학번입니다.");
                } else {
                    // 기타 오류 처리
                    throw new Error(errorData.message || "학생 등록에 실패했습니다.");
                }
            }
            return response.json();
        })
        .then((result) => {
            alert("학생이 성공적으로 등록되었습니다.");
            studentForm.reset();
            loadStudents(); // 목록 새로고침
        })
        .catch((error) => {
            console.error("Error:", error.message);
            //alert(error.message);  // 실제 서버에서 온 에러 메시지 표시
            showError(error.message);
        });
}

// 학생 목록 로드 함수
function loadStudents_then() {
    console.log("학생 목록 로드 중...");
    //Promise 객체 반환
    fetch(`${API_BASE_URL}/api/students`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("학생 목록을 불러오는데 실패했습니다.");
            }
            //JSON.parse()
            return response.json();
        })
        .then((students) => {            
            //console.log(students);
            renderStudentTable(students);
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("학생 목록을 불러오는데 실패했습니다.");
        });
}

//async/await 구문을 사용한 학생 목록 로드 함수
async function loadStudents() {
    console.log("학생 목록 로드 중...");
    try {
        const response = await fetch(`${API_BASE_URL}/api/students`);
        if (!response.ok) throw new Error("학생 목록을 불러오는데 실패했습니다.");

        const students = await response.json();
        renderStudentTable(students);
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
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
//학번 유효성 검사 CS001, cs001
function isValidStudentNumber(studentNumber) {
    const studentNumberRegex = /^[A-Z]{2}\d{3}$/i;
    // 공백이 포함되어 들어올 수 있으므로 trim()을 사용해 양끝 공백 제거 후 검사
    return studentNumberRegex.test(studentNumber.trim());
}
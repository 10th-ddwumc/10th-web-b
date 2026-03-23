const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;
const doneList = document.getElementById("doneList") as HTMLUListElement;

addBtn.addEventListener("click", addTodo); // 추가 버튼 누르면 함수 실행

todoInput.addEventListener("keydown", (event: KeyboardEvent): void => { // 입력창에서 엔터를 누르면 실행
    if (event.key === "Enter") { // 누른 키가 엔터라면 addTodo 실행
        addTodo();
    }
});

function addTodo(): void { // 할일 추가 함수 만들기
    const text: string = todoInput.value.trim(); // 입력창에 적은 내용의 앞 뒤 공백을 제거해서 문자열에 저장

    if (text === "") { // 공백만 적었다면 리턴
        return;
    }

    const li: HTMLLIElement = document.createElement("li"); // 새로운 <li> 만들기

    const todoText: HTMLSpanElement = document.createElement("span"); // <span> 태그 생성
    todoText.innerText = text; // 태그 내부는 위에서 생성한 문자열로 채우기

    const buttonArea: HTMLDivElement = document.createElement("div"); // <div> 태그 생성, 버튼이 들어갈 영역
    buttonArea.className = "button-area"; // css 클래스 부여

    const completeBtn: HTMLButtonElement = document.createElement("button"); // 버튼 생성
    completeBtn.innerText = "완료"; // 버튼 내부 텍스트
    completeBtn.className = "complete-btn"; // css 클래스 부여

    buttonArea.appendChild(completeBtn); // buttionArea 안에 완료 버튼 넣음
    li.appendChild(todoText); // li 안에 할 일 텍스트
    li.appendChild(buttonArea); // li 안에 버튼 영역 넣기
    todoList.appendChild(li); // 완성된 li 안에 todoList 넣기

    todoInput.value = ""; // 할 일 추가하고나면 입력창 지우기

    completeBtn.addEventListener("click", (): void => { // 완료 버튼 눌렀을 때 실행될 코드
        todoText.className = "done-text"; // 완료되면 텍스트에 취소선
        completeBtn.remove(); // 완료 버튼은 제거

        const deleteBtn: HTMLButtonElement = document.createElement("button"); // 새 버튼 생서
        deleteBtn.innerText = "삭제"; // 버튼 내부 텍스트 
        deleteBtn.className = "delete-btn"; // css 클래스 부여

        buttonArea.appendChild(deleteBtn); // 버튼 영역에 삭제 버튼 추가
        doneList.appendChild(li); // 현재 <li>를 <doneList>로 이동 (appendChild는 복사가 아니고 이동)

        deleteBtn.addEventListener("click", (): void => { // 삭제 버튼 클릭하면
            li.remove(); // <li> 삭제
        });
    });
}
var todoInput = document.getElementById("todoInput");
var todoList = document.getElementById("todoList");
var doneList = document.getElementById("doneList");

todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

function addTodo() {
    var text = todoInput.value.trim();

    if (text === "") {
        return;
    }

    var li = document.createElement("li");

    var todoText = document.createElement("span");
    todoText.innerText = text;

    var buttonArea = document.createElement("div");
    buttonArea.className = "button-area";

    var completeBtn = document.createElement("button");
    completeBtn.innerText = "완료";
    completeBtn.className = "complete-btn";

    buttonArea.appendChild(completeBtn);

    li.appendChild(todoText);
    li.appendChild(buttonArea);

    todoList.appendChild(li);

    todoInput.value = "";

    completeBtn.addEventListener("click", function() {
        todoText.className = "done-text";

        completeBtn.remove();

        var deleteBtn = document.createElement("button");
        deleteBtn.innerText = "삭제";
        deleteBtn.className = "delete-btn";

        buttonArea.appendChild(deleteBtn);

        doneList.appendChild(li);

        deleteBtn.addEventListener("click", function() {
            li.remove();
        });
    });
}
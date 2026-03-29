const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

type Todo = {
    id: number;
    text: string;
};

// todo 타입의 리스트라는 뜻
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

const renderTask = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) : void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo) : void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

const getTodoText =():string => {
	return todoInput.value.trim();
};

const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTask();
};

const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t) : boolean => t.id !== todo.id);
    doneTasks.push(todo);
    renderTask();
};

const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t) : boolean => t.id !== todo.id);
    renderTask();
};

//어려움
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', () : void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
};

todoForm.addEventListener('submit', (event: Event) : void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTask();
//초기 렌더링 때는 뭔가 값이 있으면 뜰 수 있게 (뭔 소리지)
//서버 쓰는 거 아니라 없어도 동작할 것 같긴 하다는데 뭔 솔
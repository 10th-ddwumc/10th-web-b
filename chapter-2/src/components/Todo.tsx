import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useTodo } from "../context/TodoContext";

function Todo() {
    // 핵심 로직을 잘 분리시켜놓는 것이 중요
    // 이유: 로직끼리의 연관성을 생각해야 함. (TodoForm에서만 사용하는 핸들이더라도 핸들 내부 로직이 공통된 로직이면 외부에 선언하는 것이 유리)
    // context API를 사용하면 props drilling 문제 해결 가능 (컴포넌트 트리 깊숙한 곳에 데이터를 전달할 때 유용) 
    // const [todos, setTodos] = useState<TTodo[]>([]);
    // const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const { todos, completeTodo, deleteTodo, doneTodos } = useTodo();


    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>SYOON TODO</h1>
            <TodoForm />
            <div className='render-container'>
                <TodoList title='할 일'
                    todos={todos}
                    buttonLabel='완료'
                    buttoncolor='#28a745'
                    onClick={completeTodo} />
                <TodoList title='완료'
                    todos={doneTodos}
                    buttonLabel='삭제'
                    buttoncolor='#dc3545'
                    onClick={deleteTodo} />
            </div>
        </div>
    );
}

export default Todo;
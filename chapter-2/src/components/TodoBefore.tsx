import { useState, type FormEvent } from "react";
import type { TTodo } from "../types/TTodo";

const Todo = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setinput] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('동작함');        
       const text = input.trim();

         if (text) {
            const newTodo: TTodo = { id: Date.now(), text };
            console.log(input);
            setTodos((prevTodos)=> [...prevTodos, newTodo]);
            setinput('');       //이거 넣어줘야 입력창 리셋됨
        }
    };

    const completeTodo =(todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodo) => prevDoneTodo.filter((t) => t.id !== todo.id));
    };  

    return (<div className='todo-container'>
        <h1 className='todo-container__header'>SYOON TODO</h1>
        <form onSubmit={handleSubmit} className="todo-container__form">
            <input value={input} onChange={(e) => setinput(e.target.value)} className="todo-container__input" type="text" placeholder='할 일을 입력' required/>
            <button className="todo-container__button" type='submit'>할 일 추가</button>
        </form>

        <div className = "render-container">
            <div className="render-container__section">
                <h2 className='render-container__title'>할 일</h2>
                <ul id='todo-list' className='render-container__list'>
                    {todos.map((todo) => (
                        <li key={todo.id} className='render-container__item'>
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button onClick={()=>completeTodo(todo)} style={{
                                backgroundColor: '#28a745'
                            }} className='render-container__item-button'>완료</button>
                        </li>
                    ))}
                </ul>

            </div>  
             <div className="render-container__section">
                <h2 className='render-container__title'>완료</h2>
                <ul id='todo-list' className='render-container__list'>
                    {doneTodos.map((todo) => (
                        <li key={todo.id} className='render-container__item'>
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button onClick={()=>deleteTodo(todo)} style={{
                                backgroundColor: '#dc3545'
                            }} className='render-container__item-button'>삭제</button>
                        </li>
                    ))}
                </ul>

            </div>  
        </div>
    </div>);
};

export default Todo;
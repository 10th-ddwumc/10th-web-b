import { type FormEvent } from 'react'
import { useState } from 'react';
import { useTodo } from '../context/TodoContext';


const TodoForm = () => {
    const {addTodo} = useTodo();
    
    const [input, setInput] = useState<string>('');
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('동작함');
        const text = input.trim();

        if (text) {
            addTodo(text);
            setInput(''); // 이거 넣어줘야 입력창 리셋됨
            
        }
    }

    return (
        <form onSubmit={handleSubmit} className="todo-container__form">
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="todo-container__input" 
                type="text" 
                placeholder='할 일 입력' 
                required/>
            <button className="todo-container__button" type='submit'>할 일 추가</button>
        </form>
  )
}

export default TodoForm;
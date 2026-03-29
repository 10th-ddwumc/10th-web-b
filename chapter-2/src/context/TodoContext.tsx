import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { TTodo } from "../types/TTodo";

interface ITodoContext{
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
}

const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string) => {
        const newTodo: TTodo = { id: Date.now(), text };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodo) => 
            prevDoneTodo.filter((t) => t.id !== todo.id));
    }

    const completeTodo = (todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    return (
        <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export { TodoContext };

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within a TodoProvider');
    }

    return context;
};


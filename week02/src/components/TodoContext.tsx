import { createContext, type PropsWithChildren, useContext, useState } from "react";
import type { TTodo } from "../types/todo";

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
    addTodo: (text: string) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string): void => {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        const newTodo: TTodo = { id: Date.now(), text: trimmedText };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const completeTodo = (todo: TTodo): void => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo: TTodo): void => {
        setDoneTodos((prevDoneTodos) => prevDoneTodos.filter((t) => t.id !== todo.id));
    };

    return (
        <TodoContext.Provider
            value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
        >
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = (): ITodoContext => {
    const context = useContext(TodoContext);

    if (!context) {
        throw new Error("useTodo를 사용하려면 TodoProvider로 감싸야 합니다.");
    }

    return context;
};
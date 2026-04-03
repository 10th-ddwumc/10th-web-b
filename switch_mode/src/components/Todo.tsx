import { THEME, useTheme } from "../context/ThemeProvider";
import { useTodo } from "../context/TodoContext";
import clsx from "clsx";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import ThemeToggleButton from "./ThemeToggleButton";

const Todo = () => {
  const { todos, completeTodo, deleteTodo, doneTodos } = useTodo();
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        "relative min-h-screen w-full flex items-center justify-center",
        isLightMode ? "bg-white" : "bg-black",
      )}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggleButton />
      </div>
      <div className="todo-container">
        <h1 className="todo-container__header">YONG TODO</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList
            title="할 일"
            todos={todos}
            buttonLable="완료"
            buttonColor="green"
            onClick={completeTodo}
          />
          <TodoList
            title="완료"
            todos={doneTodos}
            buttonLable="삭제"
            buttonColor="red"
            onClick={deleteTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default Todo;

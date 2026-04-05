//src/components/Todo.tsx
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
        "min-h-screen w-full flex items-center justify-center px-4 transition-colors duration-300",
        isLightMode ? "bg-gray-100 text-black" : "bg-gray-900 text-white",
      )}
    >
      <div className="w-full max-w-xl flex flex-col items-center gap-4">
        <ThemeToggleButton />

        <div
          className={clsx(
            "w-full rounded-3xl p-8 shadow-xl transition-colors duration-300",
            isLightMode
              ? "bg-white text-black border border-gray-200"
              : "bg-gray-800 text-white border border-gray-700",
          )}
        >
          <h1 className="todo-container__header text-center text-5xl font-bold mb-8">
            YONG TODO
          </h1>

          <TodoForm />

          <div className="render-container mt-8 grid grid-cols-2 gap-6">
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
    </div>
  );
};

export default Todo;
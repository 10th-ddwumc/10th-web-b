//src/components/TodoForm.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import clsx from "clsx";
import { useTodo } from "../context/TodoContext";
import { THEME, useTheme } from "../context/ThemeProvider";

const TodoForm = () => {
  const [input, setInput] = useState<string>("");
  const { addTodo } = useTodo();
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();

    if (text) {
      addTodo(text);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        id="todo-input"
        className={clsx(
          "flex-1 rounded-xl px-4 py-3 outline-none border transition-colors duration-300",
          isLightMode
            ? "bg-white text-black border-gray-300 placeholder:text-gray-400"
            : "bg-gray-700 text-white border-gray-600 placeholder:text-gray-300",
        )}
        placeholder="할 일 입력"
        required
      />
      <button
        type="submit"
        className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-green-600"
      >
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;
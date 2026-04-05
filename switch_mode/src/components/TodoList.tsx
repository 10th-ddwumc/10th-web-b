//src/components/TodoList.tsx
import type { TTodo } from "../types/todo";
import { THEME, useTheme } from "../context/ThemeProvider";

interface TodoListProps {
    title: string;
    todos: TTodo[];
    buttonLable: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}

const TodoList = ({ title, todos, buttonLable, buttonColor, onClick }: TodoListProps) => {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul id="todo-list" className="render-container__list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="render-container__item"
            style={{
              backgroundColor: isLightMode ? "#ffffff" : "#374151",
            }}
          >
            <span className="render-container__item-text">{todo.text}</span>
            <button
              onClick={() => onClick(todo)}
              style={{
                backgroundColor: buttonColor,
              }}
              className="render-container__item-button"
            >
              {buttonLable}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
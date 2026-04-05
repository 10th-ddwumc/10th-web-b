//src/App.tsx
import "./App.css";
import Todo from "./components/Todo";
import { ThemeProvider } from "./context/ThemeProvider";
import { TodoProvider } from "./context/TodoContext";

function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <Todo />
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
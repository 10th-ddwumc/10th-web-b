import { TodoProvider } from './components/TodoContext';
import './App.css'
import Todo from './context/Todo';

function App() {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}

export default App
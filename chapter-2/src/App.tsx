import './App.css';
import Todo from './components/Todo';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider } from './context/ThemeProvider';
import { Layout } from './components/Layout';

function App() {
  return (<>
    <ThemeProvider>
        <Layout>
          <TodoProvider>
            <Todo/>
          </TodoProvider>
        </Layout>
    </ThemeProvider>

    {/*<TodoBefore/>*/}
  </>);
}

export default App;
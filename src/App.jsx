import { Route, Routes, HashRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList';

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/todolist" element={<TodoList />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App

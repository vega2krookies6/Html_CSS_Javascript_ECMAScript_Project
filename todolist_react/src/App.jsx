import { useState } from 'react';
import './App.css'
import Form from './components/Form'
import TodoItemList from './components/TodoItemList'
import TodoListTemplate from './components/TodoListTemplate'

function App() {
      // 입력칸에 지금 들어 있는 글자
    const [todo, setTodo] = useState("");
 
    // 할 일 목록. 처음에 세 개를 넣어 둔다.
    const [todos, setTodos] = useState([
        { id: 0, text: "리액트 소개", checked: false },
        { id: 1, text: "리액트 구조", checked: true },
        { id: 2, text: "리액트 사용", checked: false },
    ]);
 
    // 다음에 만들 할 일의 번호. 0,1,2 를 이미 썼으므로 3부터.
    const [nextId, setNextId] = useState(3);

  return (
    <>
      <TodoListTemplate form={<Form />}>
        <TodoItemList />
      </TodoListTemplate>

    </>
  )
}

export default App

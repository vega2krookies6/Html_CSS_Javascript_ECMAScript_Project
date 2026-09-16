import './App.css'
import Form from './components/Form'
import TodoListTemplate from './components/TodoListTemplate'

function App() {

  return (
    <>
      <TodoListTemplate form={<Form />}>
        템플릿 완성
      </TodoListTemplate>

    </>
  )
}

export default App

import './App.css'
import MyComponent from './components/MyComponent'
import MyComponentFunc from './components/MyComponentFunc'

function App() {

  return (
    <>
      <MyComponent name="클래스형" age={20} />
      <hr/>
      <MyComponentFunc  name="함수형" age={30} />
    </>
  )
}

export default App

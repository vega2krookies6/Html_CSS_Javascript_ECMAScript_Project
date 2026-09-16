import TodoItem from "./TodoItem";

const TodoItemList = ({ myTodos, myToggle, myRemove }) => {
    // 배열의 값 하나하나를 화면 조각으로 바꾼다
    const todoList = myTodos.map(
        ({ id, text, checked }) => (
            <TodoItem
                id={id}
                text={text}
                checked={checked}
                onToggle={myToggle}
                onRemove={myRemove}
                key={id}
            />
        )
    );
    
    return (
        <div>
            <TodoItem text="안녕" />
            <TodoItem text="리액트" />
            <TodoItem text="반가워" />

        </div>
    );
};
 
export default TodoItemList;

import TodoItem from "./TodoItem";

const TodoItemList = ({ myTodos, myToggle, myRemove }) => {
    return (
        <div>
            <TodoItem text="안녕" />
            <TodoItem text="리액트" />
            <TodoItem text="반가워" />

        </div>
    );
};
 
export default TodoItemList;

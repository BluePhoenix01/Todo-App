import Todo from "./Todo";
import { useEffect, useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:6969/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);
  function onDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-200">
          Todo List
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const todoInput = document.querySelector("#todo-input");
          const text = todoInput.value;
          fetch("http://127.0.0.1:6969/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              completed: false,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              todoInput.value = "";
              setTodos((prev) => [...prev, data]);
            });
        }}
        className="flex rounded-lg border border-gray-200 bg-slate-500 shadow-sm"
      >
        <input
          id="todo-input"
          type="text"
          placeholder="add todo"
          className="flex-1 w-full min-w-0 rounded-lg bg-transparent px-4 text-base border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 text-slate-200"
          required
        />
        <button
          type="submit"
          className="bg-slate-900 text-slate-200 min-h-10 px-4 rounded-r-lg"
        >
          Add
        </button>
      </form>
      <div className="w-full max-w-sm space-y-2">
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;

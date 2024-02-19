import { useEffect, useState } from "react";
import PropTypes from "prop-types";
function Todo({ todo, onDelete }) {
  const [completed, setCompleted] = useState(todo.completed);
  useEffect(() => {
    fetch(`http://127.0.0.1:6969/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: todo.text,
        completed,
      })
    })
  }, [completed])
  return (
    <div className="flex items-center space-x-2 px-2">
      <input
        id={todo.id}
        type="checkbox"
        checked={completed}
        onChange={() => {
          setCompleted((prev) => !prev);
        }}
        className="peer checked:bg-yellow-600 checked:border-transparent"
      />
      <label
        className="flex-1 text-sm font-medium tracking-wide peer-checked:line-through text-slate-200"
        htmlFor={todo.id}
      >
        {todo.text}
      </label>
      <button 
      onClick={() => {
        fetch(`http://127.0.0.1:6969/todos/${todo.id}`, {
          method: "DELETE",
        }).then(() => {
          onDelete(todo.id);
        })
      }}
      className="rounded-lg text-red-500">Delete</button>
    </div>
  );
}
Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
}

export default Todo;

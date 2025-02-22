import { useState } from "react";
import "./App.css";

function App() {
  const [listTodo, setListTodo] = useState<string[]>([]);
  const [todo, setTodo] = useState<string>("");

  const addTodo = () => {
    if (todo.trim() !== "") {
      setListTodo([...listTodo, todo]);
      setTodo("");
    }
  };
  return (
    <>
      <h1>TODOアプリ</h1>
      <div className="container">
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="TODOを入力"
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul>
        {listTodo.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default App;

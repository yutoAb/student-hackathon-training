import { useState } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";

type Todo = {
  id: string;
  text: string;
  isComplete: boolean;
};

function App() {
  const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>("");

  const addTodo = () => {
    if (todo.trim() !== "") {
      setListTodo([...listTodo, { id: uuid(), text: todo, isComplete: false }]);
      setTodo("");
    }
  };

  const completeTodo = (id: string) => {
    setListTodo(
      listTodo.map((item) =>
        item.id === id ? { ...item, isComplete: true } : item
      )
    );
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
        {listTodo
          .filter((item) => !item.isComplete)
          .map((item) => (
            <div className="container" key={item.id}>
              <li>{item.text}</li>
              <button onClick={() => completeTodo(item.id)}>完了</button>
            </div>
          ))}
      </ul>
    </>
  );
}

export default App;

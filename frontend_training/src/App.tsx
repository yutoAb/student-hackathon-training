import { useState } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";
import { EditTodo } from "./EditTodo";
import { useList } from "./hooks/useList";

export type Todo = {
  id: string;
  text: string;
  isComplete: boolean;
  isEdit: boolean;
};

function App() {
  const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>("");

  const list = useList();
  console.log(list);

  const addTodo = () => {
    if (todo.trim() !== "") {
      setListTodo([
        ...listTodo,
        { id: uuid(), text: todo, isComplete: false, isEdit: false },
      ]);
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

  const editTodo = (id: string) => {
    setListTodo(
      listTodo.map((item) =>
        item.id === id ? { ...item, isEdit: true } : item
      )
    );
  };

  const updateTodo = (id: string, newText: string) => {
    setListTodo(
      listTodo.map((item) =>
        item.id === id ? { ...item, text: newText, isEdit: false } : item
      )
    );
  };

  const cancelEdit = (id: string) => {
    setListTodo(
      listTodo.map((item) =>
        item.id === id ? { ...item, isEdit: false } : item
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
            <div key={item.id}>
              <div className="container">
                <li onClick={() => editTodo(item.id)}>{item.text}</li>
                <button onClick={() => completeTodo(item.id)}>完了</button>
              </div>
              {item.isEdit && (
                <EditTodo
                  todo={item}
                  updateTodo={updateTodo}
                  cancelEdit={cancelEdit}
                />
              )}
            </div>
          ))}
      </ul>
    </>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";
import { EditTodo } from "./EditTodo";
import { useList } from "./hooks/useList";

type name = `pending` | `completed` | `active`;

export type Todo = {
  id: string;
  title: string;
  name: name;
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
        { id: uuid(), title: todo, name: "pending", isEdit: false },
      ]);
      setTodo("");
    }
  };

  const completeTodo = (id: string) => {
    setListTodo(
      listTodo.map((item) =>
        item.id === id ? { ...item, name: "completed" } : item
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

  const updateTodo = (id: string, newTitle: string) => {
    setListTodo(
      listTodo.map((item) =>
        item.id === id ? { ...item, title: newTitle, isEdit: false } : item
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
          .filter((item) => item.name='completed')
          .map((item) => (
            <div key={item.id}>
              <div className="container">
                <li onClick={() => editTodo(item.id)}>{item.title}</li>
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

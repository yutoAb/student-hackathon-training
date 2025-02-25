import { useState } from "react";
import "./App.css";
// import { v4 as uuid } from "uuid";
import { EditTodo } from "./EditTodo";
import { useList } from "./hooks/useList";
import { useCreateTodo } from "./hooks/useCreateTodo";
import { useDeleteTodo } from "./hooks/useDeleteTodo";

type name = `pending` | `completed` | `active`;

export const API_URL = "http://localhost/todos";

export type Todo = {
  id: string;
  title: string;
  name: name;
  isEdit: boolean;
};

function App() {
  // const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>("");

  const listTodo = useList();
  const { createTodo } = useCreateTodo();
  const { deleteTodo } = useDeleteTodo();

  const addTodo = async () => {
    if (todo.trim() !== "") {
      try {
        await createTodo({ title: todo });
        setTodo("");
      } catch (error) {
        console.error("Todo の作成に失敗しました", error);
      }
    }
  };

  const completeTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error("Todo の削除に失敗しました", error);
    }
  };

  const editTodo = (id: string) => {
    console.log(id);
    // setListTodo(
    //   listTodo.map((item) =>
    //     item.id === id ? { ...item, isEdit: true } : item
    //   )
    // );
  };

  const updateTodo = (id: string, newTitle: string) => {
    console.log(id);
    console.log(newTitle);
    // setListTodo(
    //   listTodo.map((item) =>
    //     item.id === id ? { ...item, title: newTitle, isEdit: false } : item
    //   )
    // );
  };

  const cancelEdit = (id: string) => {
    console.log(id);
    // setListTodo(
    //   listTodo.map((item) =>
    //     item.id === id ? { ...item, isEdit: false } : item
    //   )
    // );
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
          ?.filter((item) => (item.name = "completed"))
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

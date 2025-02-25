import { useState } from "react";
import "./App.css";
import { EditTodo } from "./EditTodo";
import { useList } from "./hooks/useList";
import { useCreateTodo } from "./hooks/useCreateTodo";
import { useDeleteTodo } from "./hooks/useDeleteTodo";
import { useUpdateTodo } from "./hooks/useUpdateTodo";
import { convertNameToCompleted } from "./utils/convertNameToCompleted";
import { name } from "./models/Todo";
import { convertNameToJa } from "./utils/convertNameToCompleted";

function App() {
  const [todo, setTodo] = useState<string>("");

  const listTodo = useList();
  const { createTodo } = useCreateTodo();
  const { deleteTodo } = useDeleteTodo();
  const { updateTodo } = useUpdateTodo();

  // 編集状態を管理する state
  const [editingTodos, setEditingTodos] = useState<{ [key: string]: boolean }>(
    {}
  );

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
    setEditingTodos((prev) => ({ ...prev, [id]: true }));
  };

  const updateTodoDetails = async (
    id: string,
    newTitle: string,
    newName: name
  ) => {
    try {
      await updateTodo(id, {
        title: newTitle,
        completed: convertNameToCompleted(newName),
      });
      setEditingTodos((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Todo の更新に失敗しました", error);
    }
  };

  const cancelEdit = (id: string) => {
    setEditingTodos((prev) => ({ ...prev, [id]: false }));
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
        {listTodo?.map((item) => (
          <div key={item.id}>
            <div className="container">
              <div className="container" onClick={() => editTodo(item.id)}>
                <li>{item.title}</li>：<div>{convertNameToJa(item.name)}</div>
              </div>
              <button onClick={() => completeTodo(item.id)}>削除</button>
            </div>
            {editingTodos[item.id] && (
              <EditTodo
                todo={item}
                updateTodoDetails={updateTodoDetails}
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

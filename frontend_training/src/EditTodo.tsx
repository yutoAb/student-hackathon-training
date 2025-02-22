import { useState } from "react";
import { Todo } from "./App";

type EditTodoProps = {
  todo: Todo;
  updateTodo: (id: string, newText: string) => void;
  cancelEdit: (id: string) => void;
};
export const EditTodo: React.FC<EditTodoProps> = ({
  todo,
  updateTodo,
  cancelEdit,
}: EditTodoProps) => {
  const [editText, setEditText] = useState(todo.text);

  return (
    <div className="container">
      <input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        placeholder="TODOを編集"
      />
      <button onClick={() => updateTodo(todo.id, editText)}>更新</button>
      <button onClick={() => cancelEdit(todo.id)}>キャンセル</button>
    </div>
  );
};

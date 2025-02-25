import { useState } from "react";
import { Todo, name } from "./models/Todo";

type EditTodoProps = {
  todo: Todo;
  updateTodoDetails: (id: string, newText: string, newName: name) => void;
  cancelEdit: (id: string) => void;
};
export const EditTodo: React.FC<EditTodoProps> = ({
  todo,
  updateTodoDetails,
  cancelEdit,
}: EditTodoProps) => {
  const [editText, setEditText] = useState(todo.title);
  const [editName, setEditName] = useState<name>(todo.name);

  return (
    <div className="container">
      <input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        placeholder="TODOを編集"
      />
      <select
        value={editName}
        onChange={(e) => setEditName(e.target.value as name)}
      >
        <option value="pending">未完了</option>
        <option value="completed">完了</option>
        <option value="active">進行中</option>
      </select>
      <button onClick={() => updateTodoDetails(todo.id, editText, editName)}>
        更新
      </button>
      <button onClick={() => cancelEdit(todo.id)}>キャンセル</button>
    </div>
  );
};

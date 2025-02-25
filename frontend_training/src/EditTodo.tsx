import { useState } from "react";
import { Todo, name } from "./models/Todo";

type EditTodoProps = {
  todo: Todo;
  updateTodoDetails: (id: string, newText: string, name: name) => void;
  cancelEdit: (id: string) => void;
};
export const EditTodo: React.FC<EditTodoProps> = ({
  todo,
  updateTodoDetails,
  cancelEdit,
}: EditTodoProps) => {
  const [editText, setEditText] = useState(todo.title);

  return (
    <div className="container">
      <input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        placeholder="TODOを編集"
      />
      <button onClick={() => updateTodoDetails(todo.id, editText,todo.name)}>更新</button>
      <button onClick={() => cancelEdit(todo.id)}>キャンセル</button>
    </div>
  );
};

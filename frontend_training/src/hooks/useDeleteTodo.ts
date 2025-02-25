import { mutate } from "swr";
import { API_URL } from "../models/Todo";

export function useDeleteTodo() {
  async function deleteTodo(id: string) {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    mutate(API_URL);
  }

  return { deleteTodo };
}

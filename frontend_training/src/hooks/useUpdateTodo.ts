import { mutate } from "swr";
import { API_URL } from "../models/Todo";

export function useUpdateTodo() {
  async function updateTodo(
    id: string,
    updatedData: { title: string; completed: string }
  ) {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    // SWR のキャッシュを更新し、最新のデータを反映
    mutate(API_URL);
  }

  return { updateTodo };
}

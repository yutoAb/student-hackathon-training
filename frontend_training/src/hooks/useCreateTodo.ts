import { mutate } from "swr";
import { Todo, API_URL } from "../models/Todo";

export function useCreateTodo() {
  async function createTodo(newTodo: Omit<Todo, "id" | "name" | "isEdit">) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (!response.ok) {
      throw new Error("Failed to create a new todo");
    }

    const result = await response.json();

    mutate(API_URL);

    return result;
  }

  return { createTodo };
}

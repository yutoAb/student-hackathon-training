import { name } from "../models/Todo";

export function convertNameToCompleted(name: name): string {
  switch (name) {
    case "pending":
      return "1";
    case "completed":
      return "2";
    case "active":
      return "3";
    default:
      throw new Error(`Invalid name: ${name}`);
  }
}

export function convertNameToJa(name: name): string {
  switch (name) {
    case "pending":
      return "未完了";
    case "completed":
      return "完了";
    case "active":
      return "進行中";
    default:
      throw new Error(`Invalid name: ${name}`);
  }
}

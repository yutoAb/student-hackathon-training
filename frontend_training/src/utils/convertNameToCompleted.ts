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

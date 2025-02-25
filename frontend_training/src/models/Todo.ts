export type name = `pending` | `completed` | `active`;

export const API_URL = "http://localhost/todos";

export type Todo = {
  id: string;
  title: string;
  name: name;
  isEdit: boolean;
};
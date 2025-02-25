import useSWR from "swr";
import { Todo } from "../App";

type jsonData = {
  status: string;
  data: Todo[];
};

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json());
}

export function useList() {
  const url = "http://localhost/todos";
  const { data } = useSWR<jsonData>(url, fetcher);
  return data?.data;
}

import useSWR from "swr";
import { Todo, API_URL } from "../models/Todo";

type jsonData = {
  status: string;
  data: Todo[];
};

async function fetcher(key: string) {
  return fetch(key).then((res) => res.json());
}

export function useList() {
  const { data } = useSWR<jsonData>(API_URL, fetcher);

  const processedData = data?.data.map((todo) => ({
    ...todo,
    isEdit: false,
  }));

  return processedData;
}

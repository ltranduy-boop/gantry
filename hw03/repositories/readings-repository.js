import { readFile, writeFile } from "node:fs/promises";
export const getAll = async () => {
  const DATA_FILE = "./readings.json";
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

export const save = async (readings) => {
  const DATA_FILE = "./readings.json";
  await writeFile(DATA_FILE, JSON.stringify(readings, null, 2));
};

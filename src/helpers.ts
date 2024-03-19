import { readFile, readdir } from "node:fs/promises";
import * as path from "path";
export type IndexFile = { doc: IndexDocument; filename: string };
export type IndexDocument = { data: Record<string, any> };

export async function readJSON(filePath: string): Promise<IndexFile | null> {
  try {
    const file = await readFile(filePath, "utf8");
    const json = JSON.parse(file);
    const filename = path.basename(filePath).replace(".json", "");
    return { doc: { data: json }, filename };
  } catch (error) {
    return null;
  }
}

export async function readJsonFiles(directoryPath: string) {
  const files = await readdir(directoryPath);
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );
  return jsonFiles;
}

import { IndexDocument, IndexFile, readJSON, readJsonFiles } from "./helpers";
import { spinnerOperation } from "./utils";

import { Client } from "@opensearch-project/opensearch";

export async function bulkIndexBatch(
  client: Client,
  index: string,
  batch: IndexDocument[]
) {
  const body = batch.flatMap((doc) => {
    const document = doc.data;
    const _id = document.id;
    delete document.id;
    return [{ index: { _index: index, _id } }, document];
  });
  await client.bulk({ refresh: true, body });
}

interface BulkIndexProps {
  client: Client;
  index: string;
  directoryPath: string;
  batchSize: number;
  processDoc: (data: IndexFile) => IndexDocument;
  processList?: (data: string[]) => string[];
}

export async function bulkIndexInBatches({
  client,
  index,
  directoryPath,
  batchSize,
  processDoc,
  processList = (data) => data,
}: BulkIndexProps) {
  if (!directoryPath.endsWith("/")) {
    directoryPath += "/";
  }

  const readFiles = await readJsonFiles(directoryPath);
  const files = processList(readFiles);

  const numBatches = Math.ceil(files.length / batchSize);
  for (let i = 0; i < numBatches; i++) {
    const start = i * batchSize;
    const end = start + batchSize;
    const batch = files.slice(start, end);

    let JSONs: IndexDocument[] = [];

    await spinnerOperation({
      loadingText: `Reading batch ${i + 1}/${numBatches}`,
      successText: `Read batch ${i + 1}/${numBatches}`,
      errorText: `Failed to read batch ${i + 1}/${numBatches}`,
      operation: async () => {
        await Promise.all(
          batch.map(async (file) => {
            const filePath = directoryPath + file;
            const data = await readJSON(filePath);
            if (!!data) {
              const processedData = processDoc(data!);
              if (!!processedData) JSONs.push(processedData);
            }
          })
        );
      },
    });

    await spinnerOperation({
      loadingText: `Indexing batch ${i + 1}/${numBatches}`,
      successText: `Indexed batch ${i + 1}/${numBatches}`,
      errorText: `Failed to index batch ${i + 1}/${numBatches}`,
      operation: async () => {
        await bulkIndexBatch(client, index, JSONs);
      },
    });
  }
}

export async function listAllIndexes(client: Client) {
  const response = await client.indices.getAlias({
    index: "*",
  });
  const indexList = Object.keys(response.body)
    .map((index) => {
      if (!index.startsWith(".")) {
        return {
          index,
          aliases: Object.keys(response.body[index].aliases),
        };
      }
    })
    .filter((index) => index !== undefined) as {
    index: string;
    aliases: string[];
  }[];
  return indexList;
}

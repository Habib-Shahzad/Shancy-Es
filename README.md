# Shancy-ES

This package is designed to facilitate bulk indexing operations with Elasticsearch or OpenSearch with type-safety in typescript. (More Elastic search and related utilities are coming soon).

## Features

- **Bulk Indexing**: Efficiently index large batches of documents into OpenSearch.
- **File Handling**: Read and process JSON files from a directory for indexing.
- **Customizable Processing**: Allows for custom processing of documents and file lists before indexing.

## Installation

```bash
npm i shancy-es
```

Before using the Shancy-ES, ensure you have the following dependencies installed:

- `@opensearch-project/opensearch` for OpenSearch client.

```js
import { Client } from "@opensearch-project/opensearch";
import { bulkIndexInBatches } from "shancy-es";

const client = new Client({ node: "http://localhost:9200" });

type IndexDocument = { data: Record<string, any> };
type IndexFile = { doc: IndexDocument, filename: string };

const props = {
  client: client /* OpenSearch client instance */,
  index: "my-index",
  directoryPath: "./data",
  batchSize: 100,
  processDoc: (file: IndexFile) => {
    const data = file.doc.data;
    return {
      data: {
        id: file.filename,
        ...data,
      },
    };
  },
  processList: (data) => data.filter((doc) => true /* filtering logic */),
};

await bulkIndexInBatches(props);
```

## Fancy Spinner

```js
import { spinnerOperation } from "shancy-es";

await spinnerOperation({
  loadingText: "Processing...",
  successText: "Processing complete.",
  operation: async () => {
    // Your async operation here
  },
});
```

### More Utilities Coming Soon

Stay tuned for additional utilities to enhance your Elasticsearch/OpenSearch operations.

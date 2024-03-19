# ES Utilities Documentation

This documentation provides an overview and usage guide for the ES Utilities package designed to facilitate bulk indexing operations with Elasticsearch or OpenSearch.

## Features

- **Bulk Indexing**: Efficiently index large batches of documents into OpenSearch.
- **File Handling**: Read and process JSON files from a directory for indexing.
- **Customizable Processing**: Allows for custom processing of documents and file lists before indexing.

## Installation

Before using the ES Utilities, ensure you have the following dependencies installed:

- `@opensearch-project/opensearch` for OpenSearch client.

```js
import { Client } from "@opensearch-project/opensearch";
const client = new Client({ node: "http://localhost:9200" });

const props = {
  client: client,/* OpenSearch client instance */,
  index: "my-index",
  directoryPath: "./data",
  batchSize: 100,
  processDoc: (data) => ({ data }),
  processList: (data) => data.filter(/* filtering logic */),
};

await bulkIndexInBatches(props);
```

## Fancy Spinner

```js
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

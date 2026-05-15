import { defineConfig } from "orval";

export default defineConfig({
  wms: {
    input: {
      target: "http://localhost:8080/v3/api-docs",
    },
    output: {
      target: "src/lib/generated/wms.ts",
      schemas: "src/lib/generated/model",
      client: "react-query",
      httpClient: "axios",
      mode: "tags-split",
      clean: true,
      prettier: true,
      override: {
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: false,
        },
      },
    },
  },
});

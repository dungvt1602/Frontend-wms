import { defineConfig } from "orval";

export default defineConfig({
  wms: {
    input: {
      target: "http://localhost:8080/v3/api-docs",
    },
    output: {
      target: "src/lib/generated/wms.ts",    // File chứa các hàm gọi API được tạo ra từ OpenAPI Spec
      schemas: "src/lib/generated/model",   // Thư mục chứa các định nghĩa TypeScript cho các schema được định nghĩa trong OpenAPI Spec
      client: "react-query",
      httpClient: "axios",
      mode: "tags-split",   // Chia các hàm gọi API thành các file riêng biệt dựa trên tags được định nghĩa trong OpenAPI Spec
      clean: true,
      prettier: true,
      override: {
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: false,   // Vòng lặp vô hạn không được sử dụng trong cấu hình này
        },
      },
    },
  },
});

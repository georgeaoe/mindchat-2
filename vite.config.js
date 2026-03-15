import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 小图片转为 base64 内联，减少 HTTP 请求
    assetsInlineLimit: 4096,
    // 代码分割配置
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        // 将 React 相关库从 CDN 加载
        paths: {
          react: "https://esm.sh/react@18.2.0",
          "react-dom": "https://esm.sh/react-dom@18.2.0",
        },
        // 动态导入的 chunk 输出格式
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          // 按文件类型分目录输出
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return "img/[name]-[hash][extname]";
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return "css/[name]-[hash][extname]";
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name)) {
            return "fonts/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        manualChunks: {
          // Google AI SDK - 按需加载
          ai: ["@google/generative-ai"],
          // Markdown 渲染相关库 - 按需加载
          markdown: ["react-markdown", "rehype-highlight", "rehype-raw", "remark-gfm"],
        },
      },
    },
    // 代码分割后，单个 chunk 超过 500KB 时发出警告
    chunkSizeWarningLimit: 500,
    // 压缩配置
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
      },
    },
  },
  // 预加载关键模块
  optimizeDeps: {
    include: ["@google/generative-ai"],
  },
});

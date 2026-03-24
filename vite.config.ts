import path from "path";
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// 把 <head> 内的内联 <script> 移到 </body> 之前，防止 root DOM 未就绪时执行
function moveInlineScriptToBody(): Plugin {
  return {
    name: "move-inline-script-to-body",
    enforce: "post",
    transformIndexHtml(html) {
      // 提取 head 里所有内联 script（非外链）
      const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/g;
      const scripts: string[] = [];
      let cleaned = html.replace(scriptRe, (match, attrs: string, body: string) => {
        // 外链 script（有 src=）保留原位，内联 script 移走
        if (/src\s*=/.test(attrs)) return match;
        scripts.push(match);
        return "";
      });
      // 插入到 </body> 之前
      cleaned = cleaned.replace("</body>", scripts.join("\n") + "\n</body>");
      return cleaned;
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  plugins: [react(), viteSingleFile(), moveInlineScriptToBody()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

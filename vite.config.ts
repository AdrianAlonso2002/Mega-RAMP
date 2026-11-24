import { defineConfig } from "vite";
import { editorStageSync } from './scripts/editor-stage-sync';

export default defineConfig({
  plugins: [editorStageSync()],
  base: "./",
  build: {
    target: "es2022",
    sourcemap: false,
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        onlyExplicitManualChunks:true,
        manualChunks(id) {
          if(/StageRegistry\.ts|StageBudgets\.json/.test(id))return 'stage-index';
          const stages=/world-(\d{2})\/level-\d{2}-stages\.ts/.exec(id);if(stages)return 'stages-'+stages[1];
          if (id.includes("node_modules/three")) {
            return "three";
          }
          if (id.includes("@dimforge/rapier3d-compat")) {
            return "physics";
          }
          if (id.includes("/src/editor/")) {
            return "editor";
          }
          if (id.includes("/src/levels/world-01/")) {
            return "world-1";
          }
          if (id.includes("/src/levels/world-02/")) {
            return "world-2";
          }
          if (id.includes("/src/levels/world-03/")) {
            return "world-3";
          }
          if (id.includes("/src/levels/world-04/")) {
            return "world-4";
          }
          if (id.includes("/src/levels/world-05/")) {
            return "world-5";
          }
          if (id.includes("/src/levels/world-06/")) {
            return "world-6";
          }
          if (id.includes("/src/levels/world-08/")) return "world-8";
          if (id.includes("/src/levels/world-07/")) {
            return "world-7";
          }
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
});


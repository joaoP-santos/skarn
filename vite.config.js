import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        fractions: resolve(__dirname, "math/fractions/index.html"),
        squareroot: resolve(__dirname, "math/squareroot/index.html"),
        dilatation: resolve(__dirname, "physics/dilatation/index.html"),
        mu: resolve(__dirname, "physics/mu/index.html"),
      },
    },
  },
});

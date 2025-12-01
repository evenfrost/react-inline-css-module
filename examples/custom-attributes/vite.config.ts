import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactStylename from "../../src";

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      // Point example imports at the local source for live development
      "@evenfrost/react-inline-css-module": resolve(__dirname, "../../src"),
    },
  },
  plugins: [
    react(),
    reactStylename({
      attributeNames: {
        togglerStyleName: "togglerClassName",
        bodyStyleName: "bodyClassName",
        wrapperStyleName: "wrapperClassName",
        activeStyleName: "activeClassName",
      },
    }),
  ],
});

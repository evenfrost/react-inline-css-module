import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactStylename from "../../src";

export default defineConfig({
  root: __dirname,
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

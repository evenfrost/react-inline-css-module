import type { Plugin } from "vite";
import { name as pkgName } from "../package.json";
import { findStyleImports, handleStyleName } from "./handle-style-name";

import TransformStyleNameCreateElement from "./transform-style-name-create-element";

interface Options {
  reactVariableName?: string;
  attributeNames?: Record<string, string>;
}

export default (options: Options = {}): Plugin => {
  const { reactVariableName = "React", attributeNames = {} } = options;
  const attributeNameMap = {
    styleName: "className",
    ...attributeNames,
  };

  return {
    name: pkgName,
    enforce: "post",
    transform(code, id, options) {
      if (!/\.(tsx|jsx)$/.test(id)) return;
      const imports = findStyleImports(code).filter((item) => !item.variable);
      if (!imports.length) return;

      const s = handleStyleName(
        code,
        imports,
        reactVariableName,
        attributeNameMap
      );

      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          file: id,
          includeContent: true,
          hires: true,
        }),
      };
    },
    config() {
      return {
        optimizeDeps: {
          // https://github.com/sveltejs/kit/issues/11793
          include: [pkgName],
        },
      };
    },
  };
};

export { TransformStyleNameCreateElement };

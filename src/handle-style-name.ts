import MagicString from "magic-string";
import { name as pkgName } from "../package.json";

/**
 * Find the style files imported in the code
 */
export interface StyleImport {
  /** The statement that imports the style file */
  statement: string;
  /** Modifiers before the import statement (spaces, newlines, etc.) */
  prefixStatement: string;
  /** The variable name specified when importing the module */
  variable?: string;
  /** The file path of the imported file */
  filepath: string;
}

// Step 0: Find all style imports
export function findStyleImports(source: string): StyleImport[] {
  const pattern =
    /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.module\.(?:css|less|sass|scss|pcss))(?:'|");?/g;
  return [...source.matchAll(pattern)].map(
    ([statement, prefixStatement, variable, filepath]) => ({
      statement,
      prefixStatement,
      variable,
      filepath,
    })
  );
}

export function handleStyleName(
  source: string,
  imports: StyleImport[],
  reactVariableName: string,
  attributeNames: Record<string, string>
) {
  const stringEditor = new MagicString(source);
  const variables: string[] = [];
  const serializedAttributeNames = JSON.stringify(attributeNames);

  /**
   * Step 1: Process style imports and assign variable names to imports without one
   *
   * Example: `import './index.module.css';` => `import __cls_1 from './index.module.css';`
   */
  for (const info of imports) {
    if (!info.variable) {
      const variable = makeVariableName();
      info.variable = variable;
      variables.push(variable);

      const start = source.indexOf(info.statement);
      const end = start + info.statement.length;
      stringEditor.overwrite(
        start,
        end,
        `${info.prefixStatement}import ${variable} from '${info.filepath}';`
      );
    } else {
      variables.push(info.variable);
    }
  }

  // Step 2: Add the TransformStyleNameCreateElement import
  stringEditor.prepend(
    `import { TransformStyleNameCreateElement } from '${pkgName}';\n`
  );

  /**
   * Step 3: Wrap the original React.createElement() calls with TransformStyleNameCreateElement
   *
   * Example: `React.createElement('div', { styleName: 'a' })` => `TransformStyleNameCreateElement(React.createElement, [__cls_1], 'div', { styleName: 'a' })`
   *
   * Explanation for matching `createElement|_?jsx|_?jsxs|_?jsxDEV`: https://www.typescriptlang.org/docs/handbook/jsx.html
   */
  const pattern = new RegExp(
    `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
    "g"
  );

  let match;
  while ((match = pattern.exec(source)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    stringEditor.overwrite(
      start,
      end,
      `TransformStyleNameCreateElement(${match[1]}, [${variables.join(
        ","
      )}], ${serializedAttributeNames}, `
    );
  }

  return stringEditor;
}

function makeVariableName() {
  return `__cls_${Math.random().toString().slice(-4)}`;
}

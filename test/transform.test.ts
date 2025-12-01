import { describe, expect, it, vi } from "vitest";

import { findStyleImports, handleStyleName } from "../src/handle-style-name";
import TransformStyleNameCreateElement from "../src/transform-style-name-create-element";

const attributeNames = {
  styleName: "className",
  activeStyleName: "activeClassName",
};

describe("handleStyleName", () => {
  it("injects the attribute map into the wrapper call", () => {
    const source = `
      import './foo.module.css';
      const el = React.createElement('div', { styleName: "root", activeStyleName: "isActive" });
    `;
    const imports = findStyleImports(source).filter((item) => !item.variable);

    const s = handleStyleName(source, imports, "React", attributeNames);
    const output = s.toString();

    expect(output).toContain(
      'TransformStyleNameCreateElement(React.createElement'
    );
    expect(output).toContain(
      '"styleName":"className","activeStyleName":"activeClassName"'
    );
    expect(output).toContain(
      "import { TransformStyleNameCreateElement } from '@evenfrost/react-inline-css-module';"
    );
  });
});

describe("TransformStyleNameCreateElement", () => {
  it("merges styleName and custom style props into their target class props respecting order", () => {
    const createElementFn = vi.fn((name, props, ...extra) => ({
      name,
      props,
      extra,
    }));
    const classVariables = [
      { root: "root__1", active: "active__1", btn: "btn__1" },
    ];

    const rawProps = {
      styleName: "root btn",
      className: "base",
      activeStyleName: "active",
      activeClassName: "active-base",
      id: "demo",
    };

    TransformStyleNameCreateElement(
      createElementFn,
      classVariables,
      attributeNames,
      "div",
      rawProps,
      "child"
    );

    const [, props, ...rest] = createElementFn.mock.calls[0];
    expect(props).toEqual({
      className: "root__1 btn__1 base",
      activeClassName: "active__1 active-base",
      id: "demo",
    });
    expect(rest).toEqual(["child"]);
    expect("styleName" in props).toBe(false);
    expect("activeStyleName" in props).toBe(false);
  });

  it("warns when receiving non-string values", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    TransformStyleNameCreateElement(
      () => null,
      [{ foo: "foo__1" }],
      attributeNames,
      "div",
      {
        styleName: 123 as any,
        activeStyleName: null as any,
      }
    );

    expect(warnSpy).toHaveBeenCalledTimes(2);
    warnSpy.mockRestore();
  });
});

// @ts-nocheck
/// <reference types="../../types/style-name" />

type LocalStyleNameProps = {
  styleName?: string;
} & {
  [key in `${string}StyleName`]?: string;
};

declare module "react" {
  interface Attributes extends LocalStyleNameProps {}
  interface HTMLAttributes<T> extends LocalStyleNameProps {}
  interface SVGAttributes<T> extends LocalStyleNameProps {}
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes extends LocalStyleNameProps {}
  }
}

import React from "react";
import "./style.module.css";

export function Dropdown({ open }: { open: boolean }) {
  return (
    <div
      styleName="wrapper"
      wrapperStyleName="wrapper"
      wrapperClassName="dropdown-wrapper"
    >
      <button
        styleName="toggler"
        togglerStyleName="toggler"
        togglerClassName="dropdown-btn"
      >
        Toggle
      </button>
      <div
        styleName="body"
        bodyStyleName={open ? "bodyOpen" : "bodyClosed"}
        bodyClassName="dropdown-body"
      >
        Content
      </div>
    </div>
  );
}

export function Example() {
  return <Dropdown open />;
}

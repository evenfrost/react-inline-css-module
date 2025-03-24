declare namespace React {
  interface Attributes {
    styleName?: string;
  }
  interface HTMLAttributes<T> {
    styleName?: string;
  }
  interface SVGAttributes<T> {
    styleName?: string;
  }
}

// Solve the issue where some Ant Design (antd) components throw a type error when passing the styleName property.
declare global {
  namespace JSX {
    export interface IntrinsicAttributes {
      styleName?: string;
    }
  }
}

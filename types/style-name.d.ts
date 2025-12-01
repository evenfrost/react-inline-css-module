type StyleNameProps = {
  [key in `${string}StyleName`]?: string;
};

declare namespace React {
  interface Attributes extends StyleNameProps {}
  interface HTMLAttributes<T> extends StyleNameProps {}
  interface SVGAttributes<T> extends StyleNameProps {}
}

// Solve the issue where some Ant Design (antd) components throw a type error when passing the styleName property.
declare global {
  namespace JSX {
    export interface IntrinsicAttributes extends StyleNameProps {}
  }
}

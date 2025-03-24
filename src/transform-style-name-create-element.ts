interface StyleProps {
  className?: string;
  styleName?: string;
}

export default function TransformStyleNameCreateElement<
  Props extends StyleProps
>(
  createElementFn: (name: string, props: any, ...extra: any[]) => any,
  classVariables: { [name: string]: string }[],
  name: string,
  rawProps: Props,
  ...extra: any[]
) {
  const props = { ...rawProps };
  const styleName = props.styleName;
  // This check ensures that styleName is not empty and is of type string (though it could be an empty string).
  // If styleName is an empty string, it still needs to go inside the if block because the styleName property must be removed from props (otherwise, React will show a warning).
  if (typeof styleName === "string") {
    const newClassName = styleName
      .split(" ")
      .reduce((classNamesArr, styleName) => {
        if (classVariables.every((variable) => !variable[styleName])) {
          console.warn(
            `%c [vite-react-css-modules] variable[${styleName}] is not defined!`,
            "color: orange"
          );
          return classNamesArr;
        }
        return [
          ...classNamesArr,
          ...classVariables.map((variable) => variable[styleName]),
        ];
      }, [] as string[])
      .filter(Boolean)
      .join(" ");

    // Resolve ordering issue: should styleName be placed before or after className?
    // This only applies to ES6 and later versions of JavaScript, as property order in objects was not guaranteed in versions prior to ES6.
    const keys = Object.keys(props);
    if (keys.indexOf("className") > keys.indexOf("styleName")) {
      props.className = [newClassName, props.className]
        .filter(Boolean)
        .join(" ");
    } else {
      props.className = [props.className, newClassName]
        .filter(Boolean)
        .join(" ");
    }

    delete props.styleName;
  } else {
    if (typeof styleName !== "undefined")
      console.warn(
        "%c [vite-react-css-modules] styleName is not a string!",
        "color: red"
      );
  }
  return createElementFn(name, props, ...extra);
}

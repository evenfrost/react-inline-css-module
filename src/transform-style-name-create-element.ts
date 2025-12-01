type StyleNameProps = {
  [key in `${string}StyleName`]?: string;
};

type StyleProps = {
  className?: string;
  styleName?: string;
} & StyleNameProps;

export default function TransformStyleNameCreateElement<
  Props extends StyleProps
>(
  createElementFn: (name: string, props: any, ...extra: any[]) => any,
  classVariables: { [name: string]: string }[],
  attributeNames: Record<string, string>,
  name: string,
  rawProps: Props,
  ...extra: any[]
) {
  const props = { ...rawProps };
  const keys = Object.keys(props);

  for (const [stylePropName, targetClassProp] of Object.entries(
    attributeNames
  )) {
    const stylePropValue = (props as Record<string, any>)[stylePropName];
    if (typeof stylePropValue === "string") {
      const newClassName = stylePropValue
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

      const styleIndex = keys.indexOf(stylePropName);
      const classIndex = keys.indexOf(targetClassProp);

      if (classIndex !== -1 && styleIndex !== -1 && classIndex > styleIndex) {
        (props as Record<string, any>)[targetClassProp] = [
          newClassName,
          (props as Record<string, any>)[targetClassProp],
        ]
          .filter(Boolean)
          .join(" ");
      } else {
        (props as Record<string, any>)[targetClassProp] = [
          (props as Record<string, any>)[targetClassProp],
          newClassName,
        ]
          .filter(Boolean)
          .join(" ");
      }

      delete (props as Record<string, any>)[stylePropName];
    } else if (typeof stylePropValue !== "undefined") {
      console.warn(
        `%c [vite-react-css-modules] ${stylePropName} is not a string!`,
        "color: red"
      );
    }
  }
  return createElementFn(name, props, ...extra);
}

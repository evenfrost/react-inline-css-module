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

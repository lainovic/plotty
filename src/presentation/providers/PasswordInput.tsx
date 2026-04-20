import React from "react";

/**
 * A React component that renders a password input field with a label.
 *
 * @param label - The label to display for the input field.
 * @param initialValue - The value of the input field.
 * @param onValueChange - A callback function that is called whenever the input value changes.
 * @param style - Optional CSS styles to apply to the component.
 */

let instanceCount = 0;

export default function PasswordInput({
  label,
  initialValue,
  onValueChange,
  style,
}: {
  label: string;
  initialValue: string;
  onValueChange: (key: string) => void;
  style?: React.CSSProperties;
}) {
  const [value, setValue] = React.useState(initialValue);
  const id = React.useRef(`password-input-${++instanceCount}`).current;

  return (
    <div style={{ display: "inline-block", ...style }}>
      <label htmlFor={id}>{label}:</label>
      <input
        onPaste={(e) => e.stopPropagation()}
        style={{
          marginLeft: "10px",
          backgroundColor: "transparent",
          ...(value === ""
            ? { border: "1px solid red" }
            : { border: "none", borderBottom: "1px solid #ccc" }),
        }}
        id={id}
        type="password"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
          onValueChange(value);
        }}
      />
    </div>
  );
}

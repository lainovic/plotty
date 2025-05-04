import React from "react";

/**
 * A React component that renders a password input field with a label.
 *
 * @param label - The label to display for the input field.
 * @param value - The value of the input field.
 * @param onValueChange - A callback function that is called whenever the input value changes.
 * @param style - Optional CSS styles to apply to the component.
 */

export default function PasswordInput({
  label,
  value,
  onValueChange,
  style,
}: {
  label: string;
  value: string;
  onValueChange: (key: string) => void;
  style?: React.CSSProperties;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  const [internalValue, setInternalValue] = React.useState(value);

  return (
    <div
      style={{
        display: "inline-block",
        ...style,
      }}
    >
      <label htmlFor="apiKeyField">{label}:</label>
      <input
        onPaste={(e) => {
          e.stopPropagation();
        }}
        style={{
          marginLeft: "10px",
          backgroundColor: "white",
          border: "none",
          borderBottom: "1px solid #ccc",
        }}
        id="apiKeyField"
        type="password"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          handleChange(e);
        }}
      />
    </div>
  );
}

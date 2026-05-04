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
  compact = false,
}: {
  label: string;
  initialValue: string;
  onValueChange: (key: string) => void;
  style?: React.CSSProperties;
  compact?: boolean;
}) {
  const [value, setValue] = React.useState(initialValue);
  const id = React.useRef(`password-input-${++instanceCount}`).current;

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: compact ? "column" : "row",
        alignItems: compact ? "stretch" : "center",
        gap: compact ? "2px" : "0",
        fontFamily: "'Roboto', sans-serif",
        ...style,
      }}
    >
      <label
        htmlFor={id}
        style={
          compact
            ? {
                fontSize: "0.62rem",
                color: "rgba(0,0,0,0.46)",
                fontWeight: 600,
                letterSpacing: "0.01em",
              }
            : undefined
        }
      >
        {label}
        {!compact ? ":" : null}
      </label>
      <input
        onPaste={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "transparent",
          font: "inherit",
          width: compact ? "100%" : undefined,
          fontSize: compact ? "0.82rem" : undefined,
          padding: compact ? "2px 0 4px" : undefined,
          ...(value === ""
            ? { border: compact ? "1px solid rgba(223,27,18,0.45)" : "1px solid red" }
            : { border: "none", borderBottom: "1px solid #ccc" }),
          ...(compact
            ? {
                borderRadius: "0",
                borderBottom: value === "" ? undefined : "1px solid rgba(0,0,0,0.16)",
              }
            : { marginLeft: "10px" }),
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

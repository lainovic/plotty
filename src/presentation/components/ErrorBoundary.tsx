import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>Something went wrong</h2>
          <pre style={styles.message}>{this.state.error.message}</pre>
          <button style={styles.button} onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    maxWidth: "480px",
    width: "90vw",
    fontFamily: "'Roboto', sans-serif",
    zIndex: 9999,
  },
  title: {
    margin: "0 0 12px",
    fontSize: "1.2rem",
  },
  message: {
    background: "#f5f5f5",
    borderRadius: "6px",
    padding: "12px",
    fontSize: "0.8rem",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  button: {
    marginTop: "16px",
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#333",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};

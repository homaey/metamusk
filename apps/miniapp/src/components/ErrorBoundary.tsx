import { Component, type ErrorInfo, type ReactNode } from "react";

interface State { error: Error | null }

/**
 * Top-level error boundary. Prevents a render crash from blanking the app and
 * shows a recoverable screen. Never logs sensitive payloads — only the message.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Message + component stack only; never wallet state or secrets.
    console.error("UI error:", error.message, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="app center">
          <div className="brand big"><img src="/logo.svg" className="mark" alt="" /><h1>MetaMusk</h1></div>
          <p className="lead">Something went wrong. Your funds are safe — your keys never left this device.</p>
          <button className="btn" onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

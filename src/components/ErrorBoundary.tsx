import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      let displayMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) displayMessage = `Error: ${parsed.error}`;
      } catch (e) {
        displayMessage = this.state.error.message || displayMessage;
      }

      return (
        <div className="p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Application Error</h2>
          <p className="text-red-600 mb-4">{displayMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

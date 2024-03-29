import { Component, ErrorInfo } from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="align-center flex h-screen flex-col items-center p-5 text-center">
          <h1 className="mb-10 mt-36 text-5xl font-semibold text-primary md:mt-64">
            אופס! אירעה שגיאה
          </h1>
          <p className="mb-2 text-2xl">רענן עמוד זה או נסה שנית מאוחר יותר</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

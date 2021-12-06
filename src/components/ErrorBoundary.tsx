import React from "react";

class ErrorBoundary extends React.Component<
    React.PropsWithChildren<{}>,
    { hasError: boolean; errorMessage: string; rawError?: Error }
> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false, errorMessage: "", rawError: undefined };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, errorMessage: error.message, rawError: error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error);
    }

    render() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

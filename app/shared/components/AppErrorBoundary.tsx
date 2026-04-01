"use client";

import React from "react";

interface AppErrorBoundaryProps {
    children: React.ReactNode;
}

interface AppErrorBoundaryState {
    hasError: boolean;
    message: string;
}

export default class AppErrorBoundary extends React.Component<
    AppErrorBoundaryProps,
    AppErrorBoundaryState
> {
    state: AppErrorBoundaryState = { hasError: false, message: "" };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error) {
        console.error("Unhandled error:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="mat-card">
                    <h2>Something went wrong</h2>
                    <p>{this.state.message || "Please refresh and try again."}</p>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Reload page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

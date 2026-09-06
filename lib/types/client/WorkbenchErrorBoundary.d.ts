import { Component, type ErrorInfo, type ReactNode } from 'react';
interface Props {
    children: ReactNode;
    onRetry: () => void;
}
/** Keep application failures below the host navigation and recovery controls. */
export declare class WorkbenchErrorBoundary extends Component<Props, {
    error: string | null;
}> {
    state: {
        error: string | null;
    };
    static getDerivedStateFromError(error: unknown): {
        error: string;
    };
    componentDidCatch(error: Error, info: ErrorInfo): void;
    render(): ReactNode;
}
export {};

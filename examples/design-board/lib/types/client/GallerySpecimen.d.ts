import { type ReactNode } from 'react';
export type Notice = (text: string, error?: boolean) => void;
export declare function IconAction({ label, children, onClick }: {
    label: string;
    children: ReactNode;
    onClick: () => void;
}): import("react").JSX.Element;
export declare function Specimen({ name, title, metrics, sample, children, notify }: {
    name: string;
    title: string;
    metrics: string[];
    sample: string;
    children: ReactNode;
    notify: Notice;
}): import("react").JSX.Element;

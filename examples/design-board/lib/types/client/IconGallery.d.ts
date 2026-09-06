import { type ComponentType } from 'react';
type IconItem = {
    label: string;
    name: string;
    icon: ComponentType<{
        size?: number;
        className?: string;
    }>;
    size: number;
    usage: string;
};
type IconGroup = {
    title: string;
    icons: readonly IconItem[];
};
export declare function IconGallery({ groups }: {
    groups: readonly IconGroup[];
}): JSX.Element;
export {};

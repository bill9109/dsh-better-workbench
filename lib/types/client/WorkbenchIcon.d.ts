import type { WorkbenchAppDefinition } from './types.ts';
interface Props {
    renderer: WorkbenchAppDefinition['renderIcon'];
    className?: string;
}
/** Fixed, decorative application icon slot. A bad contribution only blanks this icon. */
export declare function WorkbenchAppIcon({ renderer: Renderer, className }: Props): JSX.Element;
export {};

import type { WorkbenchAppDefinition, WorkbenchInstance } from './types.ts';
interface Props {
    renderer: WorkbenchAppDefinition['renderIcon'];
    className?: string;
    instance?: WorkbenchInstance;
}
/** Fixed, decorative application icon slot. A bad contribution only blanks this icon. */
export declare function WorkbenchAppIcon({ renderer: Renderer, className, instance }: Props): JSX.Element;
export {};

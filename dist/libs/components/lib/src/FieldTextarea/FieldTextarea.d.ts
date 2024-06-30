import { FieldRenderProps } from 'react-final-form';

type FieldProps = FieldRenderProps<any, any> & {
    children?: React.ReactNode;
};
export interface Props extends FieldProps {
    disabled?: boolean;
    children?: React.ReactNode;
    showCharacterCount?: boolean;
    'data-cy'?: string;
    customOnBlur?: (event: any) => void;
    rows?: number;
}
export declare const FieldTextarea: ({ input, meta, disabled, modifiers, customOnBlur, minLength, maxLength, showCharacterCount, rows, ...rest }: Props) => import("react/jsx-runtime").JSX.Element;
export {};

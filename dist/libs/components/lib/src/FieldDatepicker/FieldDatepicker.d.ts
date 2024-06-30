import { FieldRenderProps } from 'react-final-form';

type FieldProps = FieldRenderProps<any, any> & {
    children?: React.ReactNode;
};
export interface Props extends FieldProps {
    disabled?: boolean;
    children?: React.ReactNode;
    'data-cy'?: string;
    customOnBlur?: (event: any) => void;
    customChange?: (location: any) => void;
}
export declare const FieldDatepicker: ({ input, meta, customChange, ...rest }: Props) => import("react/jsx-runtime").JSX.Element;
export {};

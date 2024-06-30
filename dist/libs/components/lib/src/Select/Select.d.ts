import { OptionsOrGroups, Props as ReactSelectProps } from 'react-select';

export interface Props extends ReactSelectProps {
    options: OptionsOrGroups<any, any>;
    value?: any;
    onChange?: any;
    placeholder?: string;
    isMulti?: boolean;
    isClearable?: boolean;
    getOptionLabel?: any;
    getOptionValue?: any;
    defaultValue?: any;
    variant?: 'form' | 'icons';
    components?: any;
}
export declare const Select: (props: Props) => import("react/jsx-runtime").JSX.Element;

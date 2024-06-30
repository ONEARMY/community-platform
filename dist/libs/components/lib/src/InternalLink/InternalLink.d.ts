import { LinkProps as ThemedUILinkProps } from 'theme-ui';
import { LinkProps as RouterLinkProps } from 'react-router-dom';

export type Props = RouterLinkProps & ThemedUILinkProps;
export declare const InternalLink: (props: Props) => import("react/jsx-runtime").JSX.Element;

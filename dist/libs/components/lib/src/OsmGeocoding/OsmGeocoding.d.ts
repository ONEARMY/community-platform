export interface Props {
    placeholder?: string;
    debounceMs?: number;
    iconUrl?: string;
    callback?: any;
    city?: string;
    countrycodes?: string;
    acceptLanguage?: string;
    viewbox?: string;
    loading?: boolean;
}
export declare const OsmGeocoding: ({ placeholder, debounceMs, callback, acceptLanguage, viewbox, loading, }: Props) => import("react/jsx-runtime").JSX.Element;

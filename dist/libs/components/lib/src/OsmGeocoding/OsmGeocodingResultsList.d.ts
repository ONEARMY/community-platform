import { Result } from './types';

export interface Props {
    results: Result[];
    callback: any;
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare const OsmGeocodingResultsList: (props: Props) => import("react").JSX.Element;

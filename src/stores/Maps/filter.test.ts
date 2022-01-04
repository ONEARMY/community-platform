import { IMapPin } from "src/models";
import { filterMapPinsByType } from "./filter";

describe('filterMapPinsByType', () => {
    it('excludes deleted items', () => {
        const mapPins: Partial<IMapPin>[] = [
            { _deleted: true, type: 'member' },
        ];
        expect(filterMapPinsByType(mapPins as IMapPin[], ['member'])).toHaveLength(0)
    });

    it('only returns item which match the filter', () => {
        const mapPins: Partial<IMapPin>[] = [
            { _deleted: false, type: 'member' },
            { _deleted: false, type: 'machine-builder' }
        ];
        expect(filterMapPinsByType(mapPins as IMapPin[], ['member'])).toHaveLength(1)
    });
})
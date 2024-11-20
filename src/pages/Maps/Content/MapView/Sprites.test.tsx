import { act, waitFor } from "@testing-library/react";
import { testingThemeStyles } from "src/test/utils/themeUtils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClusterIcon } from "./Sprites"

import type { DivIcon, MarkerCluster } from "leaflet";
import type { MockedObject} from "vitest";

const Theme = testingThemeStyles;

vi.mock('theme-ui', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    useThemeUI: () => ({theme: Theme}),
  }))

describe('Sprites', () => {
    describe("createClusterIcon", () => {
        const mockCluster: unknown = {
            getChildCount: vi.fn()
        }
        beforeEach(() => {
            (mockCluster as MockedObject<MarkerCluster>)
                .getChildCount.mockReset()
        });
        it('calculates only a valid colour', async () => {
            (mockCluster as MockedObject<MarkerCluster>)
                .getChildCount.mockReturnValue(2);
            let resultIcon: DivIcon | null = null
            act(() => {
                resultIcon = createClusterIcon()(mockCluster as MarkerCluster);
            });
            await waitFor(() => {
                expect((mockCluster as MockedObject<MarkerCluster>)
                    .getChildCount).toHaveBeenCalledTimes(2);
                expect(resultIcon).not.toBeNull();
                expect(resultIcon!.options.html).not.toContain("NaN");
            });
        });
        it('outline is 4px when at least 2', async () => {
            (mockCluster as MockedObject<MarkerCluster>)
                .getChildCount.mockReturnValue(2);
            let resultIcon: DivIcon | null = null
            act(() => {
                resultIcon = createClusterIcon()(mockCluster as MarkerCluster);
            });
            await waitFor(() => {
                expect((mockCluster as MockedObject<MarkerCluster>)
                    .getChildCount).toHaveBeenCalledTimes(2);
                expect(resultIcon).not.toBeNull();
                expect(resultIcon!.options.html).toContain("outline: 4px");
            });
        });
        it('outline is 24px when 50', async () => {
            (mockCluster as MockedObject<MarkerCluster>)
                .getChildCount.mockReturnValue(50);
            let resultIcon: DivIcon | null = null
            act(() => {
                resultIcon = createClusterIcon()(mockCluster as MarkerCluster);
            });
            await waitFor(() => {
                expect((mockCluster as MockedObject<MarkerCluster>)
                    .getChildCount).toHaveBeenCalledTimes(2);
                expect(resultIcon).not.toBeNull();
                expect(resultIcon!.options.html).toContain("outline: 24px");
            });
        });
        it('outline doesn\'t go past 24px', async () => {
            (mockCluster as MockedObject<MarkerCluster>)
                .getChildCount.mockReturnValue(Math.floor(Math.random() * 30) + 50);
            let resultIcon: DivIcon | null = null
            act(() => {
                resultIcon = createClusterIcon()(mockCluster as MarkerCluster);
            });
            await waitFor(() => {
                expect((mockCluster as MockedObject<MarkerCluster>)
                    .getChildCount).toHaveBeenCalledTimes(2);
                expect(resultIcon).not.toBeNull();
                expect(resultIcon!.options.html).toContain("outline: 24px");
            });
        });
    });
});
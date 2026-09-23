import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DownloadCounter } from "@/components/ui/download-counter";

describe('DownloadCounter', () => {
  it('formats large numbers with commas', () => {
    const { getByText } = render(<DownloadCounter total={1234567} />);

    expect(getByText('1,234,567 downloads')).toBeInTheDocument();
  });

  it('uses the plural "downloads" for counts other than one', () => {
    const { getByText } = render(<DownloadCounter total={5} />);

    expect(getByText('5 downloads')).toBeInTheDocument();
  });

  it('uses the singular "download" when total is exactly 1', () => {
    const { getByText } = render(<DownloadCounter total={1} />);

    expect(getByText('1 download')).toBeInTheDocument();
  });

  it('renders "0 downloads" when total is 0', () => {
    const { getByText } = render(<DownloadCounter total={0} />);

    expect(getByText('0 downloads')).toBeInTheDocument();
  });

  it('falls back to 0 when total is undefined', () => {
    const { getByText } = render(<DownloadCounter total={undefined} />);

    expect(getByText('0 downloads')).toBeInTheDocument();
  });

  it('falls back to 0 when total is null', () => {
    const { getByText } = render(<DownloadCounter total={null} />);

    expect(getByText('0 downloads')).toBeInTheDocument();
  });
});
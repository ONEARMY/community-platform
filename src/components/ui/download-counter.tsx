const numberWithCommas = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export function DownloadCounter({ total }: { total?: number }) {
  return (
    <span className="text-xs text-muted-foreground" data-cy="file-download-counter">
      {numberWithCommas(total || 0)}
      {total !== 1 ? ' downloads' : ' download'}
    </span>
  );
}

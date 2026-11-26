const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  let i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  if (Number((bytes / Math.pow(1024, i)).toPrecision(3)) >= 1000 && i < sizes.length - 1) {
    i++;
  }
  return (bytes / Math.pow(1024, i)).toPrecision(3) + ' ' + sizes[i];
};

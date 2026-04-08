import type { NewsContentReachOption } from 'oa-shared';

type NewsNewsContentReachOptionsLabelList = {
  [option in NewsContentReachOption]: string;
};

export const fileLabels = {
  fileLink: {
    title: 'Or add a download link',
    placeholder: 'Link to Google Drive, Dropbox, Grabcad etc',
  },
  files: {
    title: 'Attach your file(s) for this update',
    description: 'Maximum file size 50MB',
    descriptionAdmin: 'Maximum file size 300MB',
    error: 'Please provide either a file link or upload a file, not both.',
  },
};

export const contentReach: NewsNewsContentReachOptionsLabelList = {
  all: 'Regular post',
  important: 'Big update',
  none: 'Silent (no email)',
};

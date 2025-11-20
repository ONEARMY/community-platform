/* eslint-disable @typescript-eslint/no-unused-vars */
import { DownloadWithDonationAsk } from './DownloadWithDonationAsk';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/DownloadWithDonationAsk',
  component: DownloadWithDonationAsk,
} as Meta<typeof DownloadWithDonationAsk>;

const downloadProps = {
  body: 'Body Text for the donation request',
  iframeSrc: 'https://donorbox.org/embed/ppcpdonor?language=en',
  imageURL:
    'https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9',
  fileDownloadCount: 45,
  fileLink: 'https://example.com',
  handleClick: async () => {
    alert('Clicked');
  },
  files: [
    {
      url: 'https://example.com/file1.pdf',
      name: 'Long name file, needs to wrap to the next line (File 1)',
      id: 'file1',
      size: 20000000,
    },
    {
      url: 'https://example.com/file2.pdf',
      name: 'File 2',
      id: 'file2',
      size: 3000,
    },
  ],
};

export const WithFileLink: StoryFn<typeof DownloadWithDonationAsk> = () => {
  const { files, ...props } = downloadProps;
  return <DownloadWithDonationAsk {...props} />;
};

export const WithOneFile: StoryFn<typeof DownloadWithDonationAsk> = () => {
  const { fileLink, ...rest } = downloadProps;
  const props = { ...rest, files: [rest.files[0]] };
  return <DownloadWithDonationAsk {...props} />;
};

export const WithFiles: StoryFn<typeof DownloadWithDonationAsk> = () => {
  const { fileLink, ...props } = downloadProps;
  return <DownloadWithDonationAsk {...props} />;
};

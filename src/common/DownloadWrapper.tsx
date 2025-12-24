import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DownloadButton, DownloadCounter, DownloadStaticFile, ExternalLink } from 'oa-components';
import { Button, Flex } from 'theme-ui';

import { trackEvent } from './Analytics';
import { DonationRequestModalContainer } from './DonationRequestModalContainer';
import { UserAction } from './UserAction';

import type { MediaFile } from 'oa-shared';

interface IProps {
  contentType: 'research' | 'projects';
  fileDownloadCount: number;
  fileLink?: string;
  files?: MediaFile[];
  authorProfileId?: number;
}

export const DownloadWrapper = (props: IProps) => {
  const { fileLink, files, fileDownloadCount, authorProfileId, contentType } = props;
  const hasFiles = files && files.length > 0;
  const [openModal, setOpenModal] = useState(false);
  const [link, setLink] = useState('');

  const navigate = useNavigate();

  if (!fileLink && !hasFiles) {
    return null;
  }

  useEffect(() => {
    if (sessionStorage.getItem('loginRedirect') && (fileLink || hasFiles)) {
      sessionStorage.removeItem('loginRedirect');
      if (files && files?.length === 1) {
        setOpenModal(true);
      }
    }
  }, [fileLink, hasFiles]);

  const handleLoggedOutDownloadClick = () => {
    sessionStorage.setItem('loginRedirect', 'true');
    navigate(`/sign-in?returnUrl=${encodeURIComponent(`${location?.pathname}`)}`);
  };

  return (
    <UserAction
      loggedIn={
        <>
          <DonationRequestModalContainer
            isOpen={openModal}
            onDidDismiss={() => setOpenModal(false)}
            profileId={authorProfileId}
          >
            <Flex
              sx={{
                backgroundColor: 'offWhite',
                borderRadius: '0 0 4px 4px',
                flexDirection: ['column', 'row'],
                padding: 2,
                gap: 2,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <ExternalLink
                href={link}
                onClick={() => setOpenModal(false)}
                data-cy="DonationRequestSkip"
                data-testid="DonationRequestSkip"
              >
                <Button>Download</Button>
              </ExternalLink>
            </Flex>
          </DonationRequestModalContainer>

          <>
            {fileLink && (
              <DownloadButton
                isLoggedIn
                onClick={() => {
                  setLink(fileLink);
                  setOpenModal(true);
                  trackEvent({
                    action: 'donationModalOpened',
                    category: contentType,
                  });
                }}
              />
            )}
            {files && (
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                {files.map((file, index) => (
                  <DownloadStaticFile
                    file={file}
                    key={file ? file.url : `file-${index}`}
                    fileDownloadCount={props.fileDownloadCount}
                    handleClick={() => {
                      setLink(file.url!);
                      setOpenModal(true);
                      trackEvent({
                        action: 'donationModalOpened',
                        category: contentType,
                      });
                    }}
                    isLoggedIn
                  />
                ))}
              </Flex>
            )}
            <DownloadCounter total={props.fileDownloadCount} />
          </>
        </>
      }
      loggedOut={
        <>
          <DownloadButton isLoggedIn={false} onClick={handleLoggedOutDownloadClick} />
          <DownloadCounter total={fileDownloadCount} />
        </>
      }
    />
  );
};

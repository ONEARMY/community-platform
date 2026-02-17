import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

/*************************************************************************************
 *  Embed an Iframe
 *
 *  NOTE - it is designed to only set the src on initial mount (not on prop change).
 *  This is so that postmessages can be used to communicate nav changes from the iframe
 *  up to the parent component, update the parent url and avoid double-refresh of the
 *  page.
 *************************************************************************************/

interface IProps {
  src: string;
}

const ExternalEmbed = ({ src }: IProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO - possible compatibility fallback for addEventListener (IE8)
    // Example: https://davidwalsh.name/window-iframe
    window.addEventListener('message', handlePostmessageFromIframe, false);

    return () => {
      window.removeEventListener('message', handlePostmessageFromIframe, false);
    };
  }, []);

  /**
   * Custom method to allow communication from Iframe to parent via postmessage
   */
  const handlePostmessageFromIframe = (e: MessageEvent) => {
    // only allow messages from specific sites (academy dev and live)
    if ([targetOrigin].includes(e.origin)) {
      // communicate url changes, update navbar
      if (e.data && e.data.pathname) {
        let newPathName = e.data.pathname;

        /**
         * At the moment this component is only used for handling contents within the `/academy`
         * section of the site. If we want to use this elsewhere this should lifted outside of the component
         * perhaps moved to an emitted event
         */
        if (!newPathName.startsWith(`/academy`)) {
          newPathName = `/academy${newPathName}`;
        }
        navigate(newPathName, { viewTransition: true });
      }
      // communicate a href link clicks, open link in new tab
      if (e.data && e.data.linkClick) {
        window.open(e.data.linkClick, '_blank');
      }
    }
  };

  if (!src) {
    return null;
  }

  const url = new URL(src);
  const targetOrigin = url.protocol + '//' + url.hostname + (url.port ? ':' + url.port : '');

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <iframe
        src={src}
        style={{
          border: 0,
          height: '100%',
          width: '100%',
        }}
        title="precious plastic academy"
      />
    </div>
  );
};
export default ExternalEmbed;

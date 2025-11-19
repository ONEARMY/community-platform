import { Logger } from 'tslog';

import { getConfigurationOption } from '../config/config';

const logLevel = getConfigurationOption('VITE_LOG_LEVEL', 'info');
const logTransport = getConfigurationOption('VITE_LOG_TRANSPORT', 'none');

const levelNumberToNameMap = {
  silly: 0,
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

const type = 'pretty';

export const logger = new Logger({
  type,
  minLevel: process.env.NODE_ENV === 'test' ? 999 : levelNumberToNameMap[logLevel],
  hideLogPositionForProduction: true,
});

if (logTransport === 'googleCloudLogging') {
  logger.attachTransport((logObj) => {
    const msg = logObj[0];
    delete logObj[0];
    logObj['msg'] = msg;

    sendBeaconData(`//${window.location.hostname}/_logging`, logObj);
  });
}

const sendBeaconData = (url, data) => {
  const jsonData = JSON.stringify(data);
  // eslint-disable-next-line no-console
  console.log('sendBeaconData', jsonData);

  if (navigator.sendBeacon) {
    // Try using Beacon API
    if (!navigator.sendBeacon(url, jsonData)) {
      // If Beacon API fails, fallback to Fetch API
      fallbackToFetchAPI(url, jsonData);
    }
  } else {
    // If Beacon API is not available, fallback to Fetch API
    fallbackToFetchAPI(url, jsonData);
  }
};

const fallbackToFetchAPI = (url, data) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
    keepalive: true, // In case this is a page unload event
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Fetch failed:', error);
  });
};

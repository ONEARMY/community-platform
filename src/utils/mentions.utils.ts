export const changeUserReferenceToPlainText = (text: string = '') => {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/@([A-Za-z0-9_-]+)/, '@​$1')
    .replace(/@@\{([A-Za-z0-9_-]+):([a-z0-9_-]+)}/g, '@$2');
};

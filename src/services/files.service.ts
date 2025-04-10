const incrementDownloadCount = async (
  type: 'project' | 'research_update',
  id: number,
) => {
  await fetch(`/api/downloads/${type}/${id}/count`, {
    method: 'POST',
  })
}

const downloadFile = () => {
  // TODO
}

export const downloadsService = {
  incrementDownloadCount,
  downloadFile,
}

import type { Remake, RemakeDTO } from 'oa-shared';

const getRemakes = async (projectId: number): Promise<Remake[]> => {
  const response = await fetch(`/api/projects/${projectId}/remakes`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch remakes' }));
    const errorMessage = errorData.error || errorData.message || 'Failed to fetch remakes';
    throw new Error(errorMessage);
  }

  const { remakes } = (await response.json()) as { remakes: Remake[] | undefined };

  if (!Array.isArray(remakes)) {
    throw new Error('Failed to fetch remakes');
  }

  return remakes;
};

const createRemake = async (projectId: number, remake: RemakeDTO) => {
  return await fetch(`/api/projects/${projectId}/remakes`, {
    method: 'POST',
    body: JSON.stringify(remake),
  });
};

const updateRemake = async (projectId: number, remakeId: number, remake: RemakeDTO) => {
  return await fetch(`/api/projects/${projectId}/remakes/${remakeId}`, {
    method: 'PUT',
    body: JSON.stringify(remake),
  });
};

const deleteRemake = async (projectId: number, remakeId: number) => {
  return await fetch(`/api/projects/${projectId}/remakes/${remakeId}`, {
    method: 'DELETE',
  });
};

export const remakeService = {
  getRemakes,
  createRemake,
  updateRemake,
  deleteRemake,
};

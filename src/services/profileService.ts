import {
  DBMedia,
  type IImpactDataField,
  type IUserImpact,
  type MapPin,
  type MapPinFormData,
  type Profile,
  type ProfileDTO,
  type ProfileFormData,
} from 'oa-shared';
import { logger } from 'src/logger';
import { createFormData } from './formDataHelper';

const get = async (): Promise<Profile | undefined> => {
  try {
    const url = new URL('/api/profile', window.location.origin);

    const response = await fetch(url);

    return (await response.json()) as Profile;
  } catch (error) {
    logger.error('Failed to fetch profile', { error });
  }
};

const update = async (value: ProfileFormData) => {
  const url = new URL('/api/profile', window.location.origin);
  const data = createFormData<ProfileDTO>({
    username: value.username,
    displayName: value.displayName,
    about: value.about,
    country: value.country,
    type: value.type.toString(),
    isContactable: value.isContactable,
    website: value.website,
    showVisitorPolicy: value.showVisitorPolicy,
    visitorPreferenceDetails: value.showVisitorPolicy ? value.visitorPreferenceDetails : undefined,
    visitorPreferencePolicy: value.showVisitorPolicy ? value.visitorPreferencePolicy || null : null,
    tagIds: value.tagIds && value.tagIds.length > 0 ? value.tagIds : null,
    photo: value.photo ? DBMedia.fromPublicMedia(value.photo) : null,
    coverImages:
      value.coverImages && value.coverImages.length > 0
        ? value.coverImages.map(DBMedia.fromPublicMedia)
        : null,
  });

  const response = await fetch(url, {
    body: data,
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update profile' }));
    const errorMessage = errorData.error || errorData.message || 'Failed to update profile';
    throw new Error(errorMessage);
  }

  const result = (await response.json()) as Profile | null;

  if (!result) {
    throw new Error('Failed to update profile');
  }

  return result;
};

const upsertPin = async (pin: MapPinFormData): Promise<MapPin> => {
  const data = createFormData<MapPinFormData>({
    name: pin.name,
    country: pin.country,
    countryCode: pin.countryCode,
    administrative: pin.administrative || '',
    postCode: pin.postCode || '',
    lat: pin.lat,
    lng: pin.lng,
  });

  const response = await fetch(`/api/settings/map`, {
    method: 'POST',
    body: data,
  });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving research' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving research';
    throw new Error(errorMessage, { cause: response.status });
  }

  const { mapPin } = await response.json();

  return mapPin as MapPin;
};

const deletePin = async () => {
  const response = await fetch(`/api/settings/map`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete map pin' }));
    const errorMessage = errorData.error || errorData.message || 'Failed to delete map pin';
    throw new Error(errorMessage);
  }

  return;
};

const updateImpact = async (year: number, fields: IImpactDataField[]): Promise<IUserImpact> => {
  const data = new FormData();

  data.append('year', year.toString());
  data.append('fields', JSON.stringify(fields));

  const response = await fetch('/api/settings/impact', {
    method: 'POST',
    body: data,
  });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving research' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving research';
    throw new Error(errorMessage, { cause: response.status });
  }

  const { impact } = await response.json();

  return JSON.parse(impact) as IUserImpact;
};

export const profileService = {
  get,
  update,
  upsertPin,
  deletePin,
  updateImpact,
};

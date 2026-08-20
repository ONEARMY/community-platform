// Folders the generic image picker/upload feature is allowed to browse and write to.
// Checked server-side on every request - never trust a path coming from the client alone.
export const IMAGE_PICKER_PATHS = ['categories'] as const;

export type ImagePickerPath = (typeof IMAGE_PICKER_PATHS)[number];

export function isAllowedImagePickerPath(path: string): path is ImagePickerPath {
  return (IMAGE_PICKER_PATHS as readonly string[]).includes(path);
}

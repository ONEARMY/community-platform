import type { EditorView } from '@tiptap/pm/view';
import type { MediaWithPublicUrl } from 'oa-shared';

type ImageUploadHandler = (image: File) => Promise<MediaWithPublicUrl | null>;

const insertImage = (view: EditorView, src: string) => {
  const { schema } = view.state;
  view.dispatch(view.state.tr.replaceSelectionWith(schema.nodes.image.create({ src })));
};

const uploadAndInsert = async (
  view: EditorView,
  file: File,
  imageUploadHandler: ImageUploadHandler,
) => {
  const mediaFile = await imageUploadHandler(file);
  if (mediaFile) {
    insertImage(view, mediaFile.publicUrl);
  }
};

const filenameFromUrl = (url: string): string => {
  try {
    return new URL(url).pathname.split('/').pop() || 'image';
  } catch {
    return 'image';
  }
};

export const handleImagePaste = (
  view: EditorView,
  event: ClipboardEvent,
  imageUploadHandler: ImageUploadHandler,
): boolean => {
  const clipboardData = event.clipboardData;
  if (!clipboardData) {
    return false;
  }

  const imageFiles = Array.from(clipboardData.items)
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter((file): file is File => !!file);

  if (imageFiles.length > 0) {
    event.preventDefault();
    imageFiles.forEach((file) => {
      // No fallback URL to insert if the upload itself fails — just drop it rather
      // than leave an unhandled rejection.
      void uploadAndInsert(view, file, imageUploadHandler).catch(() => {});
    });
    return true;
  }

  const html = clipboardData.getData('text/html');
  const src = html.match(/<img[^>]+src="([^"]+)"/i)?.[1];

  if (!src) {
    return false;
  }

  if (src.startsWith('data:image/')) {
    event.preventDefault();
    void fetch(src)
      .then((response) => response.blob())
      .then((blob) =>
        uploadAndInsert(view, new File([blob], 'image', { type: blob.type }), imageUploadHandler),
      )
      .catch(() => {
        // Upload failed — unlike the external-URL case, there's no sane fallback (we
        // don't want to insert the raw base64 back into the document), so just drop it.
      });
    return true;
  }

  if (/^https?:\/\//.test(src)) {
    event.preventDefault();
    void fetch(src)
      .then((response) => response.blob())
      .then((blob) =>
        uploadAndInsert(
          view,
          new File([blob], filenameFromUrl(src), { type: blob.type }),
          imageUploadHandler,
        ),
      )
      .catch(() => {
        // Likely CORS-blocked — fall back to linking the original external image
        // rather than silently dropping it.
        insertImage(view, src);
      });
    return true;
  }

  event.preventDefault();
  return true;
};

import type { EditorView } from '@tiptap/pm/view';
import type { MediaWithPublicUrl } from 'oa-shared';

type ImageUploadHandler = (image: File) => Promise<MediaWithPublicUrl | null>;

const insertImage = (view: EditorView, src: string) => {
  const { schema } = view.state;
  view.dispatch(view.state.tr.replaceSelectionWith(schema.nodes.image.create({ src })));
};

const toSafeFetchUrl = (rawSrc: string): string | null => {
  try {
    const parsed = new URL(rawSrc);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    const normalized = parsed.toString();
    return isFetchableUrl(normalized) ? normalized : null;
  } catch {
    return null;
  }
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

// Literal loopback/private/link-local hosts (the last of which includes cloud metadata
// endpoints like 169.254.169.254). Blocking these keeps a malicious paste from making a
// privileged author's own browser fetch — or worse, publish a hotlink to — an internal
// address only reachable from their machine/network. This can't catch DNS rebinding
// (a hostname that only resolves to a private IP at request time), which client-side JS
// has no way to pre-check — but it stops the common literal-address case for free.
const isPrivateHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host === '0.0.0.0' || host === '::1') {
    return true;
  }
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (!ipv4) {
    return false;
  }
  const first = Number(ipv4[1]);
  const second = Number(ipv4[2]);
  return (
    first === 127 ||
    first === 10 ||
    first === 0 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 169 && second === 254)
  );
};

const isFetchableUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      !isPrivateHost(parsed.hostname)
    );
  } catch {
    return false;
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

  const dataImageMatch = src.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=\s]+$/);
  if (dataImageMatch) {
    event.preventDefault();
    const dataImageSrc = dataImageMatch[0];
    try {
      const parsed = dataImageSrc.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=\s]+)$/,
      );
      if (!parsed) {
        return true;
      }

      const mimeType = parsed[1];
      const base64Data = parsed[2].replace(/\s+/g, '');
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType });
      void uploadAndInsert(
        view,
        new File([blob], 'image', { type: blob.type }),
        imageUploadHandler,
      ).catch(() => {
        // Upload failed — unlike the external-URL case, there's no sane fallback (we
        // don't want to insert the raw base64 back into the document), so just drop it.
      });
    } catch {
      // Invalid/undecodable base64 payload — drop it.
    }
    return true;
  }

  if (/^https?:\/\//.test(src)) {
    event.preventDefault();

    const safeSrc = toSafeFetchUrl(src);
    if (!safeSrc) {
      // A private/internal/loopback address (or invalid URL) — don't fetch it, and
      // don't insert it as a plain hotlink either (a published article would then
      // make every viewer's browser hit it too).
      return true;
    }

    void fetch(safeSrc)
      .then((response) => response.blob())
      .then((blob) =>
        uploadAndInsert(
          view,
          new File([blob], filenameFromUrl(safeSrc), { type: blob.type }),
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

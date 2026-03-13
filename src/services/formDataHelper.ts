export function createFormData<T extends Record<string, unknown>>(data: T): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, String(item)));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}

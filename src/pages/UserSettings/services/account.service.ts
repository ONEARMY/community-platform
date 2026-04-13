const changeEmail = async (email: string, password: string) => {
  const data = new FormData();
  data.append('email', email);
  data.append('password', password);

  const response = await fetch('/api/account/change-email', {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to change email');
  }

  return response;
};

const changePassword = async (oldPassword: string, newPassword: string) => {
  const data = new FormData();
  data.append('oldPassword', oldPassword);
  data.append('newPassword', newPassword);

  const response = await fetch('/api/account/change-password', {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to change password');
  }

  return response;
};

export const accountService = {
  changeEmail,
  changePassword,
};

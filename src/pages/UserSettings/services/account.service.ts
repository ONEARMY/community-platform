const changeEmail = async (email: string, password: string) => {
  const data = new FormData()
  data.append('email', email)
  data.append('password', password)

  return await fetch('/api/account/change-email', {
    method: 'POST',
    body: data,
  })
}

const changePassword = async (oldPassword: string, newPassword: string) => {
  const data = new FormData()
  data.append('oldPassword', oldPassword)
  data.append('newPassword', newPassword)

  return await fetch('/api/account/change-password', {
    method: 'POST',
    body: data,
  })
}

export const accountService = {
  changeEmail,
  changePassword,
}

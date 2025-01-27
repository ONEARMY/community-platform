const changeEmail = async (email: string, password: string) => {
  const data = new FormData()
  data.append('email', email)
  data.append('password', password)

  return await fetch('/api/account/change-email', {
    method: 'POST',
    body: data,
  })
}

export const accountService = {
  changeEmail,
}

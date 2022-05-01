export const AuthWrapper = (props: any) => {
  const additionalAdmins = props?.additionalAdmins || []

  if (!additionalAdmins.includes(props.roleRequired)) {
    return null
  }

  return <>{props.children}</>
}

export const AuthWrapper = (props: any) => {
  if (!props.additionalAdmins.includes(props.roleRequired)) {
    return null
  }

  return <>{props.children}</>
}

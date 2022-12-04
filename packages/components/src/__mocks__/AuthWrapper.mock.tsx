export const AuthWrapper = (props: {
  additionalAdmins: string[]
  children: React.ReactElement
  roleRequired: string
}) => {
  if (!props.additionalAdmins.includes(props.roleRequired)) {
    return null
  }

  return <>{props.children}</>
}

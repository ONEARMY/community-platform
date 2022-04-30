export const AuthWrapper = (props: any) => {
  console.log(`MockAuthWrapper:`, props)

  if (!props.additionalAdmins.includes(props.roleRequired)) {
    return null
  }

  return <>{props.children}</>
}

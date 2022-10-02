import type { ReactNode } from 'react'

export const AuthWrapper = (props: {
  additionalAdmins: string[]
  children: ReactNode
  roleRequired: string
}) => {
  if (!props.additionalAdmins.includes(props.roleRequired)) {
    return null
  }

  return <>{props.children}</>
}

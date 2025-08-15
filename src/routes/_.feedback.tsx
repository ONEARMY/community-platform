import { redirect } from '@remix-run/node'

export function loader() {
  return redirect(
    `https://onearmy.retool.com/form/0b8bbbc7-77d0-43ef-90fc-9d6dd9fda734`,
  )
}

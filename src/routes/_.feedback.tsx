import { redirect } from '@remix-run/node'

export function loader() {
  return redirect(
    `https://onearmy.retool.com/form/c48a8f5a-4f53-4c58-adda-ef4f3cd8dee1/`,
  )
}

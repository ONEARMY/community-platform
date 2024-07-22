import { redirect } from '@remix-run/node'

export async function loader() {
  return redirect('/academy')
}

export default function Index() {
  return <></>
}

import { redirect } from 'react-router';

export async function loader() {
  return redirect('/academy')
}

export default function Index() {
  return <></>
}
